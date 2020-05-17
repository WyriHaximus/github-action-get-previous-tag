const { exec } = require('child_process');
exec('git rev-list --tags --max-count=1', (err, rev, stderr) => {
    if (err) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ');
        console.log('\x1b[31m%s\x1b[0m', stderr);
        process.exit(1);

        return;
    }

    exec(`git describe --tags ${rev}`, (err, tag, stderr) => {
        if (err) {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find any tags because: ');
            console.log('\x1b[31m%s\x1b[0m', stderr);
            process.exit(1);

            return;
        }


        console.log('\x1b[32m%s\x1b[0m', `Found tag: ${tag}`);
        console.log(`::set-output name=tag::${tag}`);
        process.exit(0);
    });
});
