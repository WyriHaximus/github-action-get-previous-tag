const { exec } = require('child_process');
exec(`git for-each-ref --sort=-taggerdate --count 1 --format="%(refname:short)" "refs/tags/*"`, (err, tag, stderr) => {
    if (err) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any tags because: ');
        console.log('\x1b[31m%s\x1b[0m', stderr);
        process.exit(1);
    } else if(tag === "") {
        let timestamp = Math.floor(new Date().getTime() / 1000);
        console.log('\x1b[33m%s\x1b[0m', 'Falling back to default tag');
        console.log('\x1b[32m%s\x1b[0m', `Found tag: ${process.env.INPUT_FALLBACK}`);
        console.log('\x1b[32m%s\x1b[0m', `Found timestamp: ${timestamp}`);
        console.log(`::set-output name=tag::${process.env.INPUT_FALLBACK}`);
        console.log(`::set-output name=timestamp::${timestamp}`);
        process.exit(0);
    }

    tag = tag.trim()

    exec(`git log -1 --format=%at ${tag}`, (err, timestamp, stderr) => {
        if (err) {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find any timestamp because: ');
            console.log('\x1b[31m%s\x1b[0m', stderr);
            process.exit(1);
        }

        timestamp = timestamp.trim()

        console.log('\x1b[32m%s\x1b[0m', `Found tag: ${tag}`);
        console.log('\x1b[32m%s\x1b[0m', `Found timestamp: ${timestamp}`);
        console.log(`::set-output name=tag::${tag}`);
        console.log(`::set-output name=timestamp::${timestamp}`);
        process.exit(0);
    });
});
