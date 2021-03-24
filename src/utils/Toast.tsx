import React, { useEffect, useReducer } from "react";
import { sub, pub, unsub } from "./subpub";

type useToastProps = {
  msg: string;
  onHide?(id?: number): void;
  autoHide?: boolean;
  time?: number;
};

type ToastProps = useToastProps & {
  id: number;
};

type Action =
  | { type: "add"; payload: ToastProps }
  | { type: "remove"; payload: number }
  | { type: "clear" };

let toast_id = 0;

const reducer = (state: ToastProps[], action: Action): ToastProps[] => {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    case "remove":
      return state.filter((item) => item.id !== action.payload);
    case "clear":
      return [];
    default:
      return state;
  }
};

const ToastItem: React.FC<ToastProps> = ({
  id,
  msg,
  autoHide = true,
  onHide,
  time = 1000,
}) => {
  return (
    <div onClick={() => removeToast(id, onHide)} key={id}>
      {msg}
    </div>
  );
};

export const showToast = (toastProps: useToastProps): number => {
  let id = toast_id++;
  pub("add", { ...toastProps, id });
  return id;
};

export const removeToast = (
  id: number,
  callback?: Function | undefined
): void => {
  pub("remove", id);
  typeof callback === "function" && callback(id);
};

export const closeAll = (): void => {
  pub("clear");
};

const Toast: React.FC = () => {
  const [toasts, dispatch] = useReducer(reducer, []);
  const add = (toastProps: ToastProps) => {
    dispatch({ type: "add", payload: toastProps });
    let { autoHide = true, time = 1000, id, onHide } = toastProps;
    if (autoHide) {
      setTimeout(() => {
        removeToast(id, onHide);
      }, time);
    }
  };
  const remove = (id: number) => {
    dispatch({ type: "remove", payload: id });
  };
  useEffect(() => {
    sub("add", add);
    sub("remove", remove);
    return () => {
      unsub("add", add);
      unsub("remove", remove);
    };
  });
  return (
    <div>
      {toasts.map((item: ToastProps) => {
        return <ToastItem {...item} key={item.id} />;
      })}
    </div>
  );
};
export default Toast;
