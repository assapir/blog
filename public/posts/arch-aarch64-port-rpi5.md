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

I didn't want to mess with my working Pi setup, so I built a VM image and tested it in [UTM](https://getutm.app/) on my Mac. I wrote up the [full procedure as a gist](https://gist.github.com/assapir/8081b2cedafdc7d0b0f79d79a7da1a04), but here's the short version of what happened.

The idea is simple: create a raw disk image on the Pi, partition it, extract the drzee bootstrap tarball, install the kernel, set up a bootloader, convert to qcow2, and boot it in UTM. In practice, I spent most of my time fighting with GRUB.

`grub-mkconfig` inside a chroot on a loop device produced a config file full of null bytes. I wrote `grub.cfg` by hand, but then GRUB couldn't find its own modules across partitions. I tried `--boot-directory` to put the modules on the EFI partition. That got further, but then GRUB refused to load the kernel — "plain image kernel not supported, rebuild with CONFIG_EFI_STUB enabled." I gave up on GRUB.

**systemd-boot took about 30 seconds to set up** and worked on the first try. The key thing I learned: mount the FAT32 EFI partition at `/boot`, not `/boot/efi`. That way pacman drops the kernel and initramfs directly where the bootloader can see them. No copying, no hooks.

The other gotcha: the bootstrap tarball ships with root **locked** (`root:*` in `/etc/shadow`). Not an empty password — *no* password works. I booted the VM, stared at the login prompt, and had to mount the image again to fix it. Don't forget to run `passwd`.

## Installing on a Real Raspberry Pi 5

If you want to try this on actual hardware, I wrote a [step-by-step guide](https://gist.github.com/assapir/bfb047ac1abc1d1adf112b7bdbdef2d5). It's simpler than the VM — the RPi firmware handles booting, so no GRUB/systemd-boot needed. You install `linux-rpi5` from the `[forge]` repo, which auto-generates `config.txt` and `cmdline.txt`. The only manual step is downloading `start4.elf` and `fixup4.dat` from GitHub since no package provides them.

## So Should You Switch?

Honestly, **probably not yet**. The packages are the same versions, ALARM's RPi 5 support is more complete, and you get real mirrors instead of one person's S3 bucket.

But I'm keeping an eye on this. The fact that `linux-rpi5` explicitly replaces `linux-rpi-16k` tells me someone is building this with the intent of being a real ALARM alternative. If an RFC ever gets approved and this moves onto official Arch infrastructure with proper mirrors and multiple maintainers, it'll be the obvious choice. We're not there yet.