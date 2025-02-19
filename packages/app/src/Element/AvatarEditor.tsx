import Icon from "Icons/Icon";
import { useState } from "react";
import useFileUpload from "Upload";
import { openFile, unwrap } from "SnortUtils";

interface AvatarEditorProps {
  picture?: string;
  onPictureChange?: (newPicture: string) => void;
}

export default function AvatarEditor({ picture, onPictureChange }: AvatarEditorProps) {
  const uploader = useFileUpload();
  const [error, setError] = useState("");

  async function uploadFile() {
    setError("");
    try {
      const f = await openFile();
      if (f) {
        const rsp = await uploader.upload(f, f.name);
        console.log(rsp);
        if (typeof rsp?.error === "string") {
          setError(`Upload failed: ${rsp.error}`);
        } else {
          onPictureChange?.(unwrap(rsp.url));
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(`Upload failed: ${e.message}`);
      } else {
        setError(`Upload failed`);
      }
    }
  }

  return (
    <>
      <div className="flex f-center">
        <div style={{ backgroundImage: `url(${picture})` }} className="avatar">
          <div className={`edit${picture ? "" : " new"}`} onClick={() => uploadFile().catch(console.error)}>
            <Icon name={picture ? "edit" : "camera-plus"} />
          </div>
        </div>
      </div>
      {error && <b className="error">{error}</b>}
    </>
  );
}
