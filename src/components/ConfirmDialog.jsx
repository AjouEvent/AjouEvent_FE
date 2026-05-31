import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import useConfirmStore from '../store/useConfirmStore';

export default function ConfirmDialog() {
  const { open, title, text, confirm, cancel } = useConfirmStore();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) cancel(); }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {text && <DialogDescription>{text}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={cancel}>취소</Button>
          <Button onClick={confirm}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
