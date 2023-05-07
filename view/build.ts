import { exec, spawn, execFile } from 'child_process'
import path from 'path'
import ncp from 'ncp'


const process = exec('npm run build', (err,) => {
  if (err) return;

  ncp(path.join(__dirname, 'out'), path.join(__dirname, '../server/static'), (error) => {
    if (error) {
      return console.error(error);
    }
    console.log('Exported successfully!');
  })

})

process.stdout?.on('data', (data) => console.log(data))
process.stderr?.on('data', (err) => console.error(err))





