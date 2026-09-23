# uramium

Small cli for personal use. Contains a bunch of scripts and wtv i might sometimes use

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Features

- Finding environment variables based on their value
  ("is this directory available through an environment variable")
- Writing a [yt-dlp](https://github.com/yt-dlp/yt-dlp) [archive file](https://github.com/yt-dlp/yt-dlp#video-selection) based on already downloaded music/video files
- WIP: Comparing file hash with hash string / github / ...

## Installation

```bash
git clone https://github.com/Amelith/uramium.git
cd uramium
```

I like to set an alias in `~/.bashrc` so I can access the program from anywhere without having to compile and add to path:

```bash
alias "uramium=bun /path/to/project/uramium/src/index.ts"
```

If you prefer using a single-file executable instead, I recommend looking at [bun build --compile](https://bun.com/docs/bundler/executables).  
Note I have not tested if argument parsing works on bundled executables.

## Usage

```bash
bun src/index.ts <module> <args>
```

Use `bun src/index.ts list` for a list of all modules, or `... list-full` to also view the description for each module.  
Use `bun src/index.ts help` for general help, or `help <module>` for help on a specific module.

Log level can be configured via the environment variable LOG_LEVEL (=INFO).

Available levels:

- OFF
- ERROR
- WARN
- LOG
- INFO
- DEBUG
- TRACE

This does not affect text that is outputted as the main purpose of the module; for example, running compareHash with LOG_LEVEL set to OFF will still output if the hashes match.  
Critical errors (missing arguments, ...) are also not affected by this.
