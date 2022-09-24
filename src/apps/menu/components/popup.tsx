import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from 'images/icons/close.svg';
import { IAppState } from 'store/reducers/app';
import { useSelector } from 'react-redux';
import { IRootState } from 'store/reducers';

export type PopupProps = {
    onClose: () => void;
    content: any;
    kind?: string;
};

export const Popup = forwardRef((props: PopupProps, rootRef) => {
    const appState: IAppState = useSelector((state: IRootState) => state.app);
    const ref = useRef<HTMLDivElement>();
    const refBg = useRef<HTMLDivElement>();
    const drag = {
        validElement: false,
        currentY: 0,
        initialY: 0,
    };

    useImperativeHandle(rootRef, () => ({
        close() {
            close();
        },
    }));

    const close = () => {
        if (appState.isMobile) {
            ref.current.style.transform = 'translateY(100%)';

            setTimeout(() => {
                if (ref.current) {
                    ref.current.style.marginBottom = '0';
                }

                props.onClose();
            }, 300);
        } else {
            props.onClose();
        }
    };

    const clickOutside = (event) => {
        if (event.target !== refBg.current) {
            return;
        }

        close();
    };

    const dragStart = (event) => {
        event.preventDefault();

        if (!ref.current?.contains(event.target)) {
            drag.validElement = false;
            return;
        }

        drag.validElement = true;
        drag.initialY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
    };

    const dragEnd = (event): void => {
        if (!drag.validElement) {
            return;
        }

        const height: number = ref.current.clientHeight;
        if (drag.currentY > height * 0.15) {
            close();
        } else {
            ref.current.style.marginBottom = '0';
        }

        drag.currentY = drag.initialY = 0;
        drag.validElement = false;
    };

    const dragMove = (event) => {
        event.preventDefault();

        if (!drag.validElement) {
            return;
        }

        const height: number = ref.current.clientHeight;
        refBg.current.style.transition = 'none';
        refBg.current.style.opacity = Math.min(((height - drag.currentY) / height) * 0.3, 0.3).toString();
        drag.currentY = (event.type === 'touchmove' ? event.touches[0].clientY : event.clientY) - drag.initialY;
        if (drag.currentY > 0) {
            ref.current.style.marginBottom = -drag.currentY + 'px';
        }
    };

    const onBack = (event) => {
        history.pushState({}, '', location.href);
        close();
    };

    useEffect(() => {
        refBg.current.addEventListener('mousedown', clickOutside);
        if (appState.isMobile) {
            document.addEventListener('touchstart', dragStart);
            document.addEventListener('mousedown', dragStart);
            document.addEventListener('touchmove', dragMove);
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('touchend', dragEnd);
            document.addEventListener('mouseup', dragEnd);
        }

        (ref.current.parentNode as HTMLElement).classList.add('-show');

        document.body.style.overscrollBehavior = 'contain';
        document.body.style.touchAction = 'none';
        window.addEventListener('popstate', onBack);

        return () => {
            refBg.current?.removeEventListener('mousedown', clickOutside);
            document.removeEventListener('touchstart', dragStart);
            document.removeEventListener('mousedown', dragStart);
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('touchend', dragEnd);
            document.removeEventListener('mouseup', dragEnd);
            window.removeEventListener('popstate', onBack);

            document.body.style.overscrollBehavior = '';
            document.body.style.touchAction = '';
        };
    }, []);

    return createPortal(
        <div className={'ov-popup' + (props.kind ? ' -' + props.kind : '')}>
            <div className="ov-popup__bg" ref={refBg}></div>
            <div className="ov-popup__wrapper" ref={ref}>
                <div className="ov-popup__close" onClick={close}>
                    <CloseIcon />
                </div>
                <div className="ov-popup__content">{props.content}</div>
            </div>
        </div>,
        document.querySelector('.ov')
    );
});
