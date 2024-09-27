// ** React Imports
import { ReactNode, useRef, useState, ChangeEvent } from "react";

// ** Mui Imports
import { Button, SxProps } from "@mui/material";

interface Props {
  name?: string;
  maxSize?: number;
  onFileSelect: (file: File | null, imageDataUrl: string | null) => void;
  accept?: string;
  sx?: SxProps;
  children: ReactNode;
  [key: string]: any;
}

const UploadImageButton = ({
  maxSize = 2000000,
  onFileSelect,
  name,
  children,
  accept,
  sx,
  ...rest
}: Props) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [_file, setFile] = useState<File | null>(null);

  const triggerSelect = () => {
    if (!uploadInputRef.current) return;
    uploadInputRef.current.value = "";
    uploadInputRef.current.click();
  };

  const handleReviewImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();

    if (selectedFile) {
      if (selectedFile.size > maxSize) {
        console.error(`Upload failed: File size exceeds the ${maxSize} limit.`);

        return;
      }
      setFile(selectedFile);

      fileReader.onload = () => {
        const imageDataUrl = fileReader.result as string;
        onFileSelect(selectedFile, imageDataUrl);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  return (
    <>
      <input
        name={name || ""}
        type="file"
        ref={uploadInputRef}
        style={{ display: "none" }}
        accept={accept || "image/*"}
        onChange={handleReviewImage}
      />

      <Button
        sx={{ width: "fit-content", fontWeight: 500, ...sx }}
        onClick={triggerSelect}
        variant="contained"
        {...rest}>
        {children}
      </Button>
    </>
  );
};

export default UploadImageButton;
