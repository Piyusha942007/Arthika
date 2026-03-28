import { execSync } from 'child_process';

const port = 5000;
try {
    const stdout = execSync(`netstat -ano | findstr :${port}`).toString();
    const lines = stdout.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0') {
            pids.add(pid);
        }
    });

    pids.forEach(pid => {
        console.log(`Killing process ${pid} on port ${port}...`);
        try {
            execSync(`taskkill /f /pid ${pid}`);
        } catch (e) {
            console.error(`Failed to kill process ${pid}: ${e.message}`);
        }
    });

    if (pids.size === 0) {
        console.log(`No processes found on port ${port}.`);
    } else {
        console.log(`Port ${port} should be free now!`);
    }
} catch (e) {
    console.log(`No processes found on port ${port} or error occurred.`);
}
