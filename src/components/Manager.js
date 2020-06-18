import { ipcRenderer } from 'electron';
const { dialog } = require('electron').remote;
import Path from 'path';
import slash from 'slash';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import File from './File';
import Folder from './Folder';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Manager = () => {
  const [files, setFiles] = useState([]);
  const [folderPath, setFolderPath] = useState('/');
  const [folders, setFolders] = useState(['All Files']);
  const [metadata, setMetadata] = useState({
    name: 'Folder',
    files: [
      {
        name: 'UAM Vergütungsvereinbarung.pdf',
        created: 1565178217971,
        modified: 1565178217971,
        versions: [
          {
            handle:
              '1a9c0c94e4a05c16581c29d3241d8680a7467339c309df7387ab6a264427915ccf84c0dea20ff23bdcd04cdafa29d0d7abca336cd1f2a0098da801c45d172837',
            size: 3573288,
            modified: 1565178217971,
            created: 1565176690097,
          },
        ],
      },
    ],
    folders: [
      {
        name: 'Game of Thrones',
        handle:
          'b4390daf1d0c71298c0ffda0750a865fbaa72dd7cce07e2b8f5fed7ef983fb90',
      },
    ],
  });

  useEffect(() => {
    ipcRenderer.on('files:get', (e, newMetadata) => {
      setMetadata(newMetadata);
    });
  }, []);

  function updatePath(newPath) {
    const updatedPath = slash(Path.join(folderPath, newPath));
    ipcRenderer.send('path:update', updatedPath);
    setFolderPath(updatedPath);
    setFolders([...folders, newPath]);
  }

  function goBackTo(buttonIndex) {
    /*if (folders[folders.length - 1] == goToPath) {
      return;
    }*/
    const newPath = folders.slice(0, buttonIndex + 1);
    setFolders(newPath);
    let traversedPath = [...newPath];
    traversedPath[0] = '/';
    traversedPath = slash(Path.join(...traversedPath));
    setFolderPath(traversedPath);
    ipcRenderer.send('path:update', traversedPath);
  }

  function deleteFunc(handle) {
    ipcRenderer.send('file:delete', {
      folder: folderPath,
      handle: handle,
    });
  }

  function uploadButton(e, isFolder = false) {
    dialog
      .showOpenDialog({
        properties: [
          isFolder ? 'openDirectory' : 'openFile',
          'multiSelections',
        ],
      })
      .then((result) => {
        if (!result.canceled) {
          ipcRenderer.send('files:upload', {
            folder: folderPath,
            files: result.filePaths,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function newFolder() {
    const { value: folderName } = await Swal.fire({
      title: 'Enter the folder name',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      },
    });

    if (folderName) {
      Swal.fire('', '', 'success');
      ipcRenderer.send('folder:create', {
        parentFolder: folderPath,
        folderName: folderName,
      });
    }
  }

  return (
    <Container>
      <ButtonToolbar
        className="justify-content-between"
        aria-label="Toolbar with Button groups"
      >
        <ButtonGroup>
          {folders.map((folder, index) => {
            //if (folders.length - 1 != index) {
            return (
              <Card key={index}>
                <Button onClick={() => goBackTo(index)}>{folder}</Button>
              </Card>
            );
            //}
          })}
        </ButtonGroup>
        <ButtonGroup>
          <Card className="mr-1">
            <Button onClick={() => newFolder()}>Create Folder</Button>
          </Card>
          <Card>
            <Button onClick={(e) => uploadButton(e, true)}>
              Upload Folder
            </Button>
          </Card>
          <Card>
            <Button onClick={uploadButton}>Upload Files</Button>
          </Card>
        </ButtonGroup>
      </ButtonToolbar>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Name</th>
            <th>Created</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {metadata.folders.map((folder, index) => {
            return (
              <Folder key={index} folder={folder} updatePath={updatePath} />
            );
          })}
          {metadata.files.map((file, index) => {
            return <File key={index} file={file} deleteFunc={deleteFunc} />;
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Manager;
