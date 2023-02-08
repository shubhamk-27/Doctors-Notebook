import React, { useEffect, useState } from "react";
import { Grid, Paper, TextField, Alert } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDB } from "../../contexts/DbContext";
import { useAuth } from "../../contexts/AuthContext";
import useStyles from "./styles";
import { Button, message, Upload } from "antd";
import { uploadImagepneumonia } from "./api";
import "./style.css";
const beforeUploadStyle = {
  fontSize: "16px",
  fontWeight: "normal",
  fontStretch: "normal",
  fontStyle: "normal",
  lineHeight: 2.25,
  letterSpacing: "normal",
  color: "#1a75e8",
  width: "100%",
  height: "56px",
  borderRadius: "4px",
  backgroundColor: "#e1ecff",
  textAlign: "center",
};

const afterUploadStyle = {
  fontSize: "16px",
  fontWeight: "normal",
  fontStretch: "normal",
  fontStyle: "normal",
  lineHeight: 2.25,
  letterSpacing: "normal",
  color: " #4b9667",
  width: "100%",
  height: "56px",
  borderRadius: "4px",
  backgroundColor: "#e1fff1",
  textAlign: "left",
};

const Pneomonia = ({ appointment }) => {
  const classes = useStyles();
  const [resultPneumonia, setresultPneumonia] = useState(null);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  useEffect(() => {
    console.log(resultPneumonia);
  }, [resultPneumonia]);

  const handleUpload = () => {
    if (!file) {
      return;
    }
    uploadImage({
      file,
      onSuccess: (message) => {
        console.log(message);
        // Do something on success, e.g. clear the file input
        setFile(null);
      },
      onError: (error) => {
        console.error(error);
      },
      onProgress: ({ percent }, file) => {
        console.log(`Uploading ${file.name}: ${percent}%`);
      },
    });
  };

  const handleOnChange = ({ file, fileList, event }) => {
    console.log(file, fileList, event);
    //Using Hooks to update the state to the current filelist
    setFile(fileList);
    //filelist - [{uid: "-1",url:'Some url to image'}]
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log((event.loaded / event.total) * 100);
        onProgress({ percent: (event.loaded / event.total) * 100 }, file);
      },
    };
    try {
      fmData.append("image", file);
      const data = await uploadImagepneumonia(fmData);
      setresultPneumonia(data.data[0]);
      onSuccess("Ok");
    } catch (error) {
      onError(error);
    }
  };
  return (
    <Paper className={classes.paperContent} elevation={5}>
      <div className="container">
        <div className="dashboard-container">
          <div className="content xraypred">
            <div className="upload-container">
              <h2>Upload X-Ray Image to Detect Pneumonia</h2>
              <div className="choose">
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="file-input">
                <button onClick={handleUpload}>Upload</button>
              </div>
            </div>
            {resultPneumonia === null ? (
              <div className="result-placeholder">
                <p>No Result Yet</p>
              </div>
            ) : resultPneumonia === 1 ? (
              <div className="result-container">
                <h2>Result: Normal</h2>
                <p style={{ color: "#4b9667" }}>No pneumonia detected</p>
              </div>
            ) : (
              <div className="result-container">
                <h2>Result: Pneumonia Detected</h2>
                <p style={{ color: "red" }}>
                  Please consult a doctor immediately
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default Pneomonia;
