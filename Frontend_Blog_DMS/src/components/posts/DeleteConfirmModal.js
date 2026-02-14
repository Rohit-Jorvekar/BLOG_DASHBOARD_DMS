'use client';

import Modal, { ModalHeader, ModalBody, ModalFooter } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, postTitle, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>
        Delete Post
      </ModalHeader>
      <ModalBody>
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-sm text-gray-500">
            Do you really want to delete "{postTitle}"? This action cannot be undone.
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}