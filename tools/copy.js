import path from 'path'
import chokidar from 'chokidar'
import { writeFile, copyFile, makeDir, copyDir, cleanDir } from './lib/fs'
import pkg from '../package.json'
import { format } from './run'

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy () {
    await makeDir('build')
    await makeDir('build/public/admin')
    await makeDir('build/public/admin/css')
    await Promise.all([
        // Copy package.json into build directory
        writeFile('build/package.json', JSON.stringify({
            private: true,
            engines: pkg.engines,
            dependencies: pkg.dependencies,
            //devDependencies: pkg.devDependencies,
            scripts: {
                start: 'node server.js',
            }
        }, null, 2)),
        copyDir('public', 'build/public'),
        //copyDir('src/server/messages', 'build/messages'),
        copyDir('src/server/views', 'build/views'),
        //copyDir('src/server/pdf/templates', 'build/templates'),
        copyDir('src/client/admin/', 'build/public/admin/'),
        //copyFile('Procfile', 'build/Procfile')
    ])

    if (process.argv.includes('--watch')) {
        const watcher = chokidar.watch([
            'src/messages/**/*',
            'public/**/*'
        ], { ignoreInitial: true })

        watcher.on('all', async (event, filePath) => {
            const start = new Date()
            const src = path.relative('./', filePath)
            const dist = path.join('build/', src.startsWith('src') ? path.relative('src', src) : src)
            switch (event) {
                case 'add':
                case 'change':
                    await makeDir(path.dirname(dist))
                    await copyFile(filePath, dist)
                    break
                case 'unlink':
                case 'unlinkDir':
                    cleanDir(dist, { nosort: true, dot: true })
                    break
                default:
                    return
            }
            const end = new Date()
            const time = end.getTime() - start.getTime()
            console.info(`[${format(end)}] ${event} '${dist}' after ${time} ms`)
        })
    }
}

export default copy
