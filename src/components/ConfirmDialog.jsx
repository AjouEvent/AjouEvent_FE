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
      <DialogContent showCloseButton={false} className="max-w-xs px-6 py-6">
        <DialogHeader className="items-center text-center gap-1.5">
          <DialogTitle className="text-base text-[#191F28]">{title}</DialogTitle>
          {text && (
            <DialogDescription className="text-sm text-[#6B7684] leading-relaxed">
              {text}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex-row gap-2 sm:flex-row mt-1">
          <Button variant="outline" size="sm" className="flex-1" onClick={cancel}>
            취소
          </Button>
          <Button size="sm" className="flex-1" onClick={confirm}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
