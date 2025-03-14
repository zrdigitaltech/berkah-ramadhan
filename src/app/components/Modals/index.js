import { Fragment, useEffect } from 'react';
import './modals.scss'; // Import SCSS

const Index = (props) => {
  const {
    show,
    onClose,
    modalBody,
    modalFooter,
    title,
    onCloseBackDrop,
    classModalContent,
    classModalBody,
    modalBackdrop,
    scrolls,
    styleModalContent,
    position = 'center'
  } = props;

  useEffect(() => {
    if (show && !scrolls) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [show, scrolls]);

  if (!show) return null;

  return (
    <Fragment>
      <div
        id={'myModal'}
        tabIndex="-1"
        role="dialog"
        className={`modal fade show ${position === 'top' ? 'modal-top' : 'modal-center'}`}
      >
        <div className="modal-dialog" role="document">
          <div
            className={`modal-content mt13 ${classModalContent || ''}`}
            style={styleModalContent}
          >
            {title && (
              <div className="modal-header center">
                <h5 className="modal-title">{title}</h5>
                <button onClick={onClose} className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            <div className={`modal-body ${classModalBody || ''}`}>{modalBody}</div>
            {modalFooter && (
              <center>
                <div className="modal-footer center">{modalFooter}</div>
              </center>
            )}
          </div>
        </div>
      </div>
      {modalBackdrop === false ? (
        modalBackdrop
      ) : (
        <div className="modal-backdrop fade show" onClick={onCloseBackDrop}></div>
      )}
    </Fragment>
  );
};

export default Index;
