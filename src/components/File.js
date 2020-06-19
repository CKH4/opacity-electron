import React from 'react';
import Moment from 'react-moment';
import Filesize from 'filesize';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Badge from 'react-bootstrap/Badge';
import Swal from 'sweetalert2';
const Clipboardy = require('clipboardy');
import {
  AiOutlineFile,
  AiOutlineDelete,
  AiOutlineShareAlt,
} from 'react-icons/ai';

const File = ({ file, deleteFunc }) => {
  const shareClick = (handle) => {
    Clipboardy.write('https://opacity.io/share#handle=' + handle);
    Swal.fire('', 'Copied the link to your clipboard!', 'success');
  };

  return (
    <tr>
      <td>
        <Form.Check aria-label="option 1" />
      </td>
      <td>
        <AiOutlineFile />
      </td>
      <td>{file.name.slice(0, 64)}</td>
      <td>
        <Moment format="MMM Do YYYY">{new Date(file.created)}</Moment>
      </td>
      <td>{Filesize(file.versions[0].size)}</td>
      <td>
        <ButtonGroup>
          <Button onClick={() => shareClick(file.versions[0].handle)}>
            <AiOutlineShareAlt></AiOutlineShareAlt>
          </Button>
          <Button onClick={() => deleteFunc(file.versions[0].handle)}>
            <AiOutlineDelete></AiOutlineDelete>
          </Button>
        </ButtonGroup>
      </td>
    </tr>
  );
};

export default File;
