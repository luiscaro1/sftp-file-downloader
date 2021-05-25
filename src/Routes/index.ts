import { Router, RouterOptions } from "express";
import Client from "ssh2-sftp-client";
import fs from "fs";
import AdmZip from "adm-zip";

const router = Router();

const addFiles = async (
  sftp: Client,
  source: string,
  serverDir: string,
  files: any[]
) => {
  await Promise.all(
    await files.map(async (file: { name: string }) => {
      try {
        await sftp.fastGet(
          source + "/" + file.name,
          serverDir + "/" + file.name
        );
      } catch (err) {
        throw err;
      }
    })
  );
};

router.post("/get", async (req, res) => {
  const { host, port, username, password, source, destination, filter } =
    req.body;

  const sftp = new Client();

  try {
    await sftp.connect({
      host,
      port,
      username,
      password,
    });

    const serverDir = "files" + "/" + Date.now().toString();
    await fs.mkdir(serverDir, (err) => {
      if (err) throw err;
    });

    const files = (await sftp.list(source)).filter((file) =>
      file.name.includes(filter)
    );

    await addFiles(sftp, source, serverDir, files);

    const outDir = "./zips" + "/" + source + "-" + Date.now() + ".zip";
    const zip = new AdmZip();
    await zip.addLocalFolder("./" + serverDir);
    await zip.writeZip(outDir);

    const stream = fs.createReadStream(outDir);

    stream.on("end", () => {
      fs.rmdirSync(serverDir, { recursive: true });
      fs.rmdirSync(outDir, { recursive: true });
    });
    stream.pipe(res);
    // res.download(outDir);
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
