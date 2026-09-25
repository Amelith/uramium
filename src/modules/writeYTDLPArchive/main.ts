import * as fs from 'node:fs';
import path from 'node:path';
import { styleText } from 'node:util';
import { info, log, warn } from '@utils/log.ts';
import { attempt, defineModule } from '@utils/util.ts';

export default defineModule({
  fullName: 'Write yt-dlp Archive file',
  description: 'Write the archive file used by yt-dlp, based on the existing files in the directory',
  examples: ['writeYTDLPArchive ./Music', 'writeYTDLPArchive ./Music .archive'],
  arguments: {
    'directory': {
      description: 'Directory which the files are in. Defaults to working directory',
      type: 'string',
      positional: true,
      defaultValue: process.cwd(),
    },
    'archiveFileName': {
      description: 'File name of the archive file. Default ".archive"',
      type: 'string',
      shortForm: 'f',
      defaultValue: '.archive',
    },
    'site': {
      description:
        'yt-dlp Site ID which the videos/files were downloaded from.'
        + 'Inferred from existing archive by default, or "youtube" otherwise',
      type: 'string',
    },
  },
  run: (args) => {
    const { directory, archiveFileName } = args;
    let site = args.site;

    const archiveFile = path.join(directory, archiveFileName);
    const archiveFileContent = attempt(() => fs.readFileSync(archiveFile, 'utf-8'), '');

    // store the sites found along with the amount they are found in to infer site if needed
    const sites = new Set<string>();

    const archivedIDs = new Set(
      archiveFileContent
        .split('\n')
        // yt-dlp stores the site (youtube, ...) along with the video ID, separated by space
        .map((l) => {
          if (!l) return null;
          const lastSpaceIndex = l.trim().lastIndexOf(' ');
          const site = l.slice(0, lastSpaceIndex).trim();
          const id = l.slice(lastSpaceIndex).trim();

          sites.add(site);
          return id;
        })
        .filter((s) => s !== null),
    );

    if (!site) {
      if (sites.size === 0) {
        site = 'youtube';
      } else if (sites.size === 1) {
        site = [...sites][0] ?? 'youtube';
      } else {
        throw new Error(
          `Multiple sites (${[...sites].join(', ')}) found in archive file. Please manually specify a site.`,
        );
      }
    }

    // parse existing files in directory
    const files = fs.readdirSync(directory);
    const textToAppend = files
      .map((f) => {
        if (f === archiveFileName) return null;

        const result = /(.*?)\[([^\]]+)\]\.\w+/.exec(f);
        if (!result) {
          warn(`Could not parse file name ${f}, skipping`);
          return null;
        }

        const title = result[1]?.trim();
        const id = result[2];
        if (!id) {
          warn(`Could not find ID in file name ${f}, skipping`);
          return null;
        }

        const alreadyInArchive = archivedIDs.has(id);
        if (alreadyInArchive) {
          info(
            `· File ${styleText('green', title ?? '')} ${styleText('gray', `(${id})`)} already in archive, skipping`,
          );
          return null;
        } else {
          info(`+ Adding file ${styleText('greenBright', title ?? '')} ${styleText('gray', `(${id})`)} to archive`);
          return `${site} ${id}`;
        }
      })
      .filter((i) => i !== null);

    const toAppend = textToAppend.length;

    if (toAppend === 0) {
      log(`No entries to append, total ${styleNumber(archivedIDs.size)} items`);
    } else {
      log(
        `Adding ${styleNumber(toAppend)} entr${toAppend === 1 ? 'y' : 'ies'} to archive, `
          + `total ${styleNumber(archivedIDs.size + toAppend)} items`,
      );

      const appendNewlineBefore = !!archiveFileContent && !archiveFileContent.endsWith('\n');
      fs.appendFileSync(archiveFile, `${appendNewlineBefore ? '\n' : ''}${textToAppend.join('\n')}\n`);
    }

    return 0;
  },
});

function styleNumber(n: number): string {
  return styleText('blue', n.toString());
}
