"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { convertFileToUrl } from "@/lib/utils";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const file = files?.[0];
  const isImage = file?.type?.startsWith("image/");

  return (
    <div
      {...getRootProps()}
      className={`file-upload transition-colors ${isDragActive ? "border-[#23ae7c] bg-dark-300" : ""}`}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="flex flex-col items-center gap-3">
          {isImage ? (
            <Image
              src={convertFileToUrl(file)}
              alt={file.name}
              width={160}
              height={160}
              unoptimized
              className="max-h-40 rounded-md object-contain"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-dark-500 bg-dark-400 text-center text-12-regular text-light-200">
              FILE
            </div>
          )}
          <p className="max-w-56 truncate text-14-regular text-light-200">
            {file.name}
          </p>
        </div>
      ) : (
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="upload icon"
          />
          <div>
            <p className="text-14-regular">
              <span className="text-[#23ae7c]">Click to upload</span>&nbsp; or drag and drop
            </p>
            <p>SVG, PNG, JPG or GIF (max 1920 × 1080px)</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;