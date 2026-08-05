Here is a complete Quilon program.

```quilon
^ = () -> Num => 42
```

That's it. `^` is the entry point. The `Num` it returns is the exit code. There's no `fn`, no `main`, no `return`, and before you ask: no, there is no `if` either. There is branching — it's just spelled `?`.

I wrote a programming language. It compiles through LLVM to a native binary, it has a type checker, a garbage collector, a CHANGELOG and a VS Code extension. It also has exactly one user. I want to talk about why, because the "why" here is dumber than you're expecting and it worked better than it had any right to.

## The rule

I gave myself two constraints on day one:

1. No keywords.
2. Make me laugh.

The second one is not a joke about the first one. It was the actual selection criterion. Every time there was a decision to make — how do you write a comment, how do you spell "this function returns nothing", what does a sum type look like — the funnier option won. That's the entire design methodology. There is no third constraint about ergonomics or readability or developer experience, and it shows.

What I was actually after was less funny: I wanted to know what happens between a text file and an executable. Lexer, parser, type checker, LLVM IR, object file, linker. I'd spent a decade treating that pipeline as weather. Building a small one is the only way I know to stop a thing being weather.

The name means nothing, by the way. "Quilon" is a made-up word that sounded funny to me. There's no acronym and no clever etymology, and I'd rather admit that than pretend otherwise on a page nobody asked for.

## Everything is a symbol

Worth clearing up, since "no keywords" tends to be heard as "no control flow": everything you'd expect is there, it's just punctuation. Branching is `?`, either as a ternary or as a match with `|` arms. Looping is `for n <- xs => body`, which is the one place a word survived, and I'm not thrilled about it. Nothing was removed from the language; the words were.

Here's the vocabulary, such as it is.

| Symbol | Meaning | Example |
|---|---|---|
| `=` | Immutable binding | `x = 42` |
| `:=` | Mutable bind / reassign | `counter := 0` |
| `::` | Type annotation | `x :: Num` |
| `=>` | Function body / match arm | `f = x => x + 1` |
| `->` | Return type | `f = x -> Num => x` |
| `^` | Entry point | `^ = () -> Num => 0` |
| `<<` / `>>` | Import / export | `<< core.io` |
| `\|>` | Pipe, first-arg injection | `x \|> f(a)` ≡ `f(x, a)` |
| `? :` | Ternary | `x < 0 ? -x : x` |
| `?` `\|` | Pattern match | `v ? \| 0 => "zero" \| _ => "other"` |
| `~` | Comment | `~ a note` |
| `$` | Unit — the type *and* its only value | `f = () -> $ => $` |

Two of those are genuinely hostile and I'm keeping them. `<` and `>` are block delimiters *and* comparison operators, so the parser has to work out which one you meant. And `/` is division as well as the sum-type separator:

```quilon
~ A nullary enum.
Color = Red / Green / Blue

~ Map each color to a number.
rank = (c :: Color) -> Num => c ?
  | Red   => 0
  | Green => 1
  | Blue  => 2
```

That one isn't laziness. It's how people have written alternatives since before parsers existed — red/green/blue, yes/no, and/or. Every language that makes you type `enum Color { Red, Green, Blue }` is asking you to learn a notation for something you already had a notation for. The joke and the justification are the same sentence, which is roughly the whole language in miniature.

## The keyword I had to kill

For a while there was a `mut` keyword. It sat there in the lexer being useful and being a keyword, in the language with no keywords, and eventually I stopped being able to look at it.

So it went. Mutability is now `:=`, and the CHANGELOG has a line that reads "**Breaking:** removed the `mut` keyword" for a language with no users to break. `x = 0` binds, `counter := 0` binds mutably, `counter := counter + 1` reassigns, and assigning to an immutable binding is a type error.

The unexpected part: it got better. Because `:=` is visible everywhere mutation happens, a method is a setter *if and only if* its body writes `it.field := …`. There's no `mut`, no `mutating`, no `&mut self` — the operator is the marker. Rust makes you declare it. Swift makes you declare it. I deleted a keyword to be consistent about a bit, and got the declaration for free.

## Strictly typed, one number

Quilon has a static type checker. It's about 100 KB of Rust, it does inference, it demands your pattern matches be exhaustive, and it will refuse to compile a program that reassigns an immutable binding.

It also has exactly one numeric type. `Num`. Integers and floats, all of it, one type, f64 underneath.

I have written a strict static type system and then handed it JavaScript's number model. There are no generics either, so a match must cover every variant but a variant's payload has to be a built-in type. The checker is pedantic about everything except the thing every other statically typed language is pedantic about first.

## The one part I actually thought about

```quilon
greeting = "héllo" + " 🌍"
b = greeting.size     ~ byte length     → 11
c = greeting.length   ~ grapheme count  → 7
```

`.size` is bytes. `.length` is grapheme clusters — user-perceived characters, the thing you'd get if you counted with your finger.

This is the one decision in the language that wasn't made for a laugh. "How much memory is this" and "how many characters is this" are different questions with different answers, and giving them one name is how you end up truncating a string through the middle of an emoji. So they got two names, and the one that sounds like what a person means returns what a person means.

I can't claim novelty — Swift and Elixir were here first. But look at the company it puts me in. JavaScript counts UTF-16 code units. Python counts code points. Go and C count bytes. Rust's `.len()` is bytes, and to find out how many characters a human sees you go and add the `unicode-segmentation` crate.

My runtime pulls in `unicode-segmentation`. The weekend language ships a correct string length; the serious one makes you install it.

## `^` becomes main, for now

My compiler emits a C `main` that wraps `^`, calls `__gc_init` first, and hands the result back as an exit code. So the language with no keywords quietly grows one at the very last step, in a language it isn't written in.

I could get out of that. The kernel doesn't want `main` — it wants `_start`, and `main` is a libc convention layered on top. Emit my own `_start`, dig the arguments off the stack, call `exit` myself, and `^` would be the real entry point with nothing in between. I haven't, because the C wrapper is three lines of codegen and gives me libc's startup for free, and I'd rather spend the evening on the type checker. It's laziness with a reason, which is the good kind.

Underneath, the runtime is Rust wearing a C ABI — `#[unsafe(no_mangle)] extern "C"` intrinsics, built as both a staticlib and an rlib, so the exact same symbols resolve whether you're running through the in-process LLVM JIT or a natively linked binary. Two execution paths, one set of symbols. That was the plan, anyway.

Oh — yes, there's a JIT. In a statically typed, ahead-of-time compiled, natively linked language. `quilon run` compiles your program in memory and executes it, `quilon build` hands you a binary, and nobody asked for either half of that. It exists because waiting for a linker to run before you can see whether `2 + 2` still works got old in about a day. CI runs every example down both paths and asserts the exit codes match, which is how I find out when they don't.

## The linker was the hard part

The compiler was fine. Compilers are a solved problem with a large literature and a helpful LLVM. The linker nearly ended me.

A Rust staticlib splits those `#[no_mangle]` intrinsics across codegen units, and the order of members inside the archive is unspecified. A single linker pass takes objects on demand, so it can walk straight past the object defining `__text_cmp` — and you get `undefined reference`, but only under whatever codegen-unit split that build happened to produce. It worked on my machine. It worked in CI. Then it didn't, on the same commit.

The fix is one flag:

```bash
-Wl,--whole-archive \
  -lquilon_rt \
  -Wl,--no-whole-archive
```

Take every object, stop being clever. There's a companion horror next door: `#[link(name = "gc")]` has to sit on the actual `GC_malloc` and `GC_init` references rather than in `build.rs`, because otherwise `--as-needed` decides Boehm GC isn't needed and drops it, depending on link order. Two days of my life, both of them, spent on linker flags rather than on anything resembling language design.

That flag isn't free, and you can measure it. `^ = () -> Num => 42` — the whole program, one line — builds to a **6.6 MB** executable. A Rust staticlib carries the standard library with it, so the runtime archive is 23 MB before anything of mine is in it, and `--whole-archive` says take all of it rather than only the parts referenced. `strip` gets the binary down to 1.2 MB, which means most of what's left is symbols. For scale, the compiler itself is 1.9 MB — one line of Quilon produces an artifact three times the size of the thing that compiled it.

Those numbers are from an aarch64 Raspberry Pi 5 running Arch — the same machine [the last post](/blog/arch-aarch64-port-rpi5/) was about — with LLVM 22.1.8, clang as the linker and libgc 8.2. On x86-64 they'll differ. Not enough to rescue anyone.

Section-level garbage collection at link time would fix most of that, and I haven't done it, because right now nothing depends on the number being small and quite a lot depended on the symbol being found.

## How this actually got built

I should say this plainly: I didn't type most of it. Claude wrote the bulk of the code and I reviewed it, 79 commits' worth, one pull request at a time.

That turns out to be a real way to learn a compiler, just not the one I signed up for. You cannot approve a type checker you don't understand — or rather you can, once, and then you spend an evening working out why record fields named `size` and `length` were being hijacked by the built-in `.size` path, and why a user-defined `print` was silently shadowed by the built-in one. Both of those were review catches. Both are exactly the kind of thing the author of a change doesn't see and the reader does. I learned more from being unconvinced than I would have from typing it.

## What it isn't

Version 0.9, "stable basics". No generics. No `while`. The README has a Vision section promising implicit parallelism, deep immutability and no function coloring, immediately followed by my own sentence: "Today these are direction, not delivered features." The runtime is single-threaded. I wrote a Vision section for software with one user, which is either the most or the least serious thing in this post.

It compiles, it runs, and every example in the repo goes through CI on both the JIT and the native path, under clang and gcc, with matching exit codes. That's the part I'd defend.

If you want to poke at it, please do. Issues and pull requests are very welcome — there's a bus factor of one here and I am the bus, so a second opinion on anything is worth more than it would be on a serious project. A star is welcome too, and I will absolutely check.

[github.com/assapir/quilon](https://github.com/assapir/quilon) — GPL-2.0, needs LLVM 22 and libgc.
