import { Router, RouterOptions } from "express";
import Client from "ssh2-sftp-client";

const router = Router();

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

    const files = (await sftp.list(source)).filter((file) =>
      file.name.includes(filter)
    );

    files.forEach(async (file) => {
      try {
        await sftp.fastGet(
          source + "/" + file.name,
          destination + "/" + file.name
        );
      } catch (err) {
        throw err;
      }
    });

    res.status(200).end();
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
