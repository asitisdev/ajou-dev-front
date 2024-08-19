import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Dialog {
  open: boolean;
  title: string;
  description: string;
  action: string;
  next: string;
}

const DialogContext = React.createContext<
  | undefined
  | {
      dialog: Dialog;
      setDialog: React.Dispatch<React.SetStateAction<Dialog>>;
    }
>(undefined);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = React.useState<Dialog>({
    open: false,
    title: '제목',
    description: '내용',
    action: '확인',
    next: '',
  });

  return <DialogContext.Provider value={{ dialog, setDialog }}>{children}</DialogContext.Provider>;
};

export const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error('DialogProvider 내부에서 useDialog를 사용해야 합니다');
  }

  return context;
};

export const Dialog = () => {
  const { dialog, setDialog } = useDialog();

  return (
    <AlertDialog open={dialog.open} onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
          <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link to={dialog.next}>
            <AlertDialogAction autoFocus>{dialog.action}</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
