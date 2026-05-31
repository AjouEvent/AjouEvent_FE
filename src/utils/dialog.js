import { toast } from 'sonner';
import useConfirmStore from '../store/useConfirmStore';

const dialog = {
  success(title, text) {
    toast.success(title, { description: text });
  },

  error(title, text) {
    toast.error(title, { description: text });
  },

  warning(title, text) {
    toast.warning(title, { description: text });
  },

  confirm(title, text) {
    return useConfirmStore.getState().show(title, text);
  },
};

export default dialog;
