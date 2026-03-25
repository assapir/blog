If you're running Arch Linux ARM (ALARM) on a Raspberry Pi 5 and you've come across [ports.archlinux.page/aarch64](https://ports.archlinux.page/aarch64/), you're probably wondering: is it time to switch? I spent a day poking at this — comparing packages, trying to build a bootable VM image, and fighting with bootloaders more than I'd like to admit. Here's what I learned.

## So What Actually Is This Port?

First things first: despite living under `archlinux.page`, this port is **not official**. The page says so itself:

> ⚠️ There is currently no proposed RFC for this architecture. Support is primarily provided by other Arch Linux users (i.e. not Staff).

I went and checked the official Arch mirrors (`geo.mirror.pkgbuild.com` and others) — there's no `aarch64` directory on any of them. Only `x86_64`.

The whole thing lives on a **single repo** run by one person (bschnei) on AWS S3 at `arch-linux-repo.drzee.net`. Three repos:

- **core** — 264 packages
- **extra** — 13,326 packages
- **forge** — 25 packages for stuff that doesn't exist upstream (RPi5 kernel, Electron, Kodi, etc.)

The key difference from ALARM: these packages are rebuilt straight from upstream Arch PKGBUILDs — the exact same source as x86_64. ALARM maintains its own fork with ARM-specific patches. That matters, and I'll get to why.

One catch: **ARMv8.2+ only**. RPi 5 is fine. RPi 4 and older won't work.

## Are the Packages Actually Newer?

This is what I really wanted to know. ALARM has a reputation for falling behind on core packages like glibc. I figured the drzee port would be noticeably ahead. So I pulled up versions across all three — mainline x86_64 Arch as the reference, ALARM, and drzee:

| Package | x86_64 Arch | ALARM | drzee aarch64 |
|---------|-------------|-------|---------------|
| gcc | 15.2.1+r604 | 15.2.1+r604 | 15.2.1+r**785** |
| glibc | 2.43+r5 | 2.43+r5 | 2.43+r5 |
| rust | 1.94.0 | 1.94.0 | 1.94.0 |
| go | 1.26.1 | 1.26.1 | 1.26.1 |
| python | 3.14.3 | 3.14.3 | 3.14.3 |
| systemd | 260.1 | 260 | 260.1 |
| docker | 29.3.0 | 29.3.0 | 29.3.0 |
| git | 2.53.0 | 2.53.0 | 2.53.0 |

I was surprised. They're basically identical. The only real difference is drzee's gcc has a slightly newer git snapshot (r785 vs r604), which confirms it rebuilds independently. ALARM's systemd was one point release behind. That's about it.

I also did a broader scan of all ~250 packages on my Pi and found just 4 differences: `archlinux-keyring`, `leancrypto`, `libsysprof-capture`, and `pacman-mirrorlist`. Nothing that would make you reach for the migration guide.

So the point of this port isn't that it's fresher *right now* — it's the approach. Since it rebuilds directly from upstream without ARM patches, it shouldn't get stuck when glibc or gcc bumps a major version. ALARM has historically had rough patches during those transitions. Whether that's still a real concern today is debatable.

## What About RPi 5 Support?

The `[forge]` repo has the basics:

- `linux-rpi5` — RPi Foundation kernel (it explicitly `Replaces: linux-rpi-16k`)
- `linux-firmware-rpi5` — WiFi and Bluetooth firmware
- `rpi5-eeprom` — EEPROM bootloader updates
- `raspberrypi-utils` — vcgencmd and other Pi tools

But there's a gap: **no `raspberrypi-bootloader` package**. That's the one that provides `start4.elf` and `fixup4.dat` — the boot firmware the RPi 5 EEPROM requires to start. Without them you get a fatal `Firmware (start*.elf) not found` error. On ALARM these just come with the system. Here, you have to grab them from the [raspberrypi/firmware](https://github.com/raspberrypi/firmware) GitHub repo.

The good news: the [`linux-rpi5` package](https://github.com/bschnei/linux-rpi5) handles everything else — DTBs, overlays, and it even auto-generates `config.txt` and `cmdline.txt` on first install. So it's really just those two files that are missing.

Also worth noting: ALARM's `linux-rpi-16k` uses 16KB pages, which is better for RPi 5 performance. The drzee kernel uses 4KB.

## Quick Comparison

| | ALARM | drzee aarch64 port |
|---|---|---|
| Status | Established, been around for years | Unofficial, no RFC, community effort |
| Mirrors | ~10 worldwide | One S3 bucket |
| RPi 5 support | First-class | Good — just missing `start4.elf`/`fixup4.dat` |
| Package freshness | Same as upstream right now | Same, rebuilt independently |
| Build model | ARM-patched fork of Arch | Straight upstream rebuild |
| Risk | Might lag on big toolchain bumps | One person, one host |

## Testing It in a VM

I didn't want to mess with my working Pi setup, so I built a VM image and tested it in [UTM](https://getutm.app/) on my Mac. This turned out to be more of an adventure than expected.

### Building the disk image

You need a running aarch64 Linux box to do this. I used my Pi. Install `gptfdisk`, `qemu-img`, `arch-install-scripts`, and `dosfstools` first.

```bash
# Create an 8GB raw disk
dd if=/dev/zero of=arch-aarch64.raw bs=1M count=8192

# Two partitions: FAT32 for /boot, ext4 for /
sgdisk -o \
  -n 1:0:+512M -t 1:ef00 -c 1:boot \
  -n 2:0:0     -t 2:8300 -c 2:root \
  arch-aarch64.raw

sudo losetup -fP arch-aarch64.raw
LOOP=$(losetup -j arch-aarch64.raw | cut -d: -f1)

sudo mkfs.fat -F32 ${LOOP}p1
sudo mkfs.ext4 ${LOOP}p2

# This part matters: FAT32 goes at /boot, not /boot/efi
sudo mount ${LOOP}p2 /mnt
sudo mkdir -p /mnt/boot
sudo mount ${LOOP}p1 /mnt/boot
```

Getting the mount layout right is important. FAT32 at `/boot` means the kernel and initramfs land directly on the EFI partition when you install them. I initially had it at `/boot/efi` and spent way too long debugging why the bootloader couldn't find things.

### Extracting the bootstrap and installing packages

The drzee port has [bootstrap tarballs](https://arch-linux-repo.drzee.net/arch/tarballs/os/aarch64/) — basically a minimal rootfs with pacman pre-configured to point at the drzee repos.

```bash
curl -LO https://arch-linux-repo.drzee.net/arch/tarballs/os/aarch64/archlinux-bootstrap-2026.03.15-aarch64.tar.zst
sudo tar xf archlinux-bootstrap-2026.03.15-aarch64.tar.zst -C /mnt --strip-components=1

sudo arch-chroot /mnt

# Set up pacman keyring
pacman-key --init
pacman-key --populate archlinux

# Import the drzee signing key
curl -sL https://arch-linux-repo.drzee.net/arch/extra/os/aarch64/public.key -o /tmp/drzee.key
pacman-key --add /tmp/drzee.key
pacman-key --lsign-key 0CF25682E6BA0751

# Install just enough to boot
pacman -Sy
pacman -S base linux linux-firmware efibootmgr
```

### Don't forget to set a root password

I didn't, and then I couldn't log in. The bootstrap tarball ships with root **locked** — there's literally a `*` in `/etc/shadow`. Empty password won't work either. Set one:

```bash
passwd
```

### The bootloader saga

I went with GRUB first because that's what I know. Mistakes were made.

`grub-mkconfig` inside a chroot on a loop device produced a config file full of null bytes. I wrote `grub.cfg` by hand, but then GRUB couldn't load the kernel from the ext4 partition — "plain image kernel not supported, rebuild with CONFIG_EFI_STUB enabled." I tried putting the GRUB modules on the EFI partition with `--boot-directory`. It half-worked. I gave up.

**systemd-boot is the answer.** It's already there (part of systemd), and it took about 30 seconds to set up:

```bash
echo "KEYMAP=us" > /etc/vconsole.conf
mkinitcpio -P
bootctl install --esp-path=/boot

exit  # leave chroot
```

Then write the loader config from outside the chroot:

```bash
ROOT_UUID=$(sudo blkid -s UUID -o value ${LOOP}p2)

sudo tee /mnt/boot/loader/loader.conf << 'EOF'
default arch.conf
timeout 3
EOF

sudo mkdir -p /mnt/boot/loader/entries
sudo tee /mnt/boot/loader/entries/arch.conf << EOF
title   Arch Linux (aarch64)
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=UUID=${ROOT_UUID} rw console=ttyAMA0 console=tty0
EOF
```

Because `/boot` is the FAT32 EFI partition, the kernel and initramfs are already right where systemd-boot expects them. No extra copying, no pacman hooks needed.

### Wrapping up the image

```bash
sudo bash -c "genfstab -U /mnt > /mnt/etc/fstab"
sudo umount -R /mnt
sudo losetup -d $LOOP

qemu-img convert -f raw -O qcow2 -c arch-aarch64.raw arch-aarch64.qcow2
rm arch-aarch64.raw
```

### Booting in UTM

In UTM: **Virtualize → Other**, skip the ISO, import the qcow2, make sure UEFI is selected.

UTM also supports **direct kernel boot** if you don't want to bother with a bootloader at all — just point it at the kernel and initramfs files and pass the boot arguments in the VM settings.

## Installing on a Real Raspberry Pi 5

If you want to try this on actual hardware, I wrote a full step-by-step guide as a [GitHub Gist](https://gist.github.com/assapir/bfb047ac1abc1d1adf112b7bdbdef2d5). The short version: it's similar to the VM process above, but you use the RPi firmware boot chain (`config.txt` + `cmdline.txt`) instead of UEFI/systemd-boot, and you install `linux-rpi5` from the `[forge]` repo instead of the mainline `linux` kernel. The only manual step is downloading `start4.elf` and `fixup4.dat` from GitHub — everything else (`config.txt`, `cmdline.txt`, DTBs, overlays) is handled by the `linux-rpi5` package automatically.

## So Should You Switch?

Honestly, **probably not yet**. The packages are the same versions, ALARM's RPi 5 support is more complete, and you get real mirrors instead of one person's S3 bucket.

But I'm keeping an eye on this. The fact that `linux-rpi5` explicitly replaces `linux-rpi-16k` tells me someone is building this with the intent of being a real ALARM alternative. If an RFC ever gets approved and this moves onto official Arch infrastructure with proper mirrors and multiple maintainers, it'll be the obvious choice. We're not there yet.