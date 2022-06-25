import { useClass } from '../contexts/ClassContext';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Classes(props) {
  const { setCurrentClass } = useClass();
  const navigate = useNavigate();
  const classType = props.classType;
  const classes = props.classes;

  function handleClick(clss) {
    setCurrentClass(clss)
    navigate('/class-dashboard');
  }

  return (
    <>
        {
          (classes.length > 0)
            ? classes.map((clss) => {
              return (
                <Card
                  key={clss.id}
                  className="fs-5 generic-button"
                  role='button'
                  onClick={() => handleClick(clss)}
                >
                  <Card.Body>
                    <h4
                      key={clss.id}     
                      className='d-flex align-items-center'
                      style={{ cursor: 'pointer' }}
                    >
                      <strong>{clss.className}</strong>                    
                    </h4>
                    {classType} class
                  </Card.Body>
                </Card>
              );
            })
            : <h4>No {classType} classes</h4>
        }
      </>
  );
};
