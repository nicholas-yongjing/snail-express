import { Link } from "react-router-dom";
import Button from "./Button";

export default function Header(props) {
  const headerText = props.headerText;
  const buttonText = props.buttonText;
  const linkTo = props.linkTo;
  const handleClick = props.handleClick;
  const buttonClass = props.buttonClass;

  function getButton() {
    return (
      <Button
        data-testid="button"
        className={buttonClass ? buttonClass : ""}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    );
  }

  return (
    <div
      data-testid="header"
      className="d-flex justify-content-between align-items-center p-2 w-100 "
    >
      <h1 className="fs-1">
        <strong>{headerText}</strong>
      </h1>
      {linkTo ? <Link to={linkTo}>{getButton()}</Link> : getButton()}
    </div>
  );
}
