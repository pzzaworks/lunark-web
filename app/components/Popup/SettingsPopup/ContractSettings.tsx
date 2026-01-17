"use client";

import { useState, useEffect } from 'react';
import { baseContainerStyle } from '@/constants';
import { Trash, Plus, Edit } from 'iconoir-react';
import Button from '../../Base/Button';
import { toast } from 'react-hot-toast';
import { useUserContext } from '@/contexts';
import { createAxiosInstance } from '@/lib/axios';
import LoadingIcon from '../../Base/LoadingIcon';
import Popup from '../../Popup/Popup';
import ContactFormPopup from '../ContactFormPopup';

interface Contact {
  id: string;
  name: string;
  address: string;
  networks: string[];
  notes?: string;
  metadata?: string;
}

const ContractSettings = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const { user } = useUserContext();

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await createAxiosInstance().get(`/contacts/${user.id}`);
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowFormPopup(true);
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setShowFormPopup(true);
  };

  const handleDelete = async (contactId: string) => {
    setSelectedContactId(contactId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!user || !selectedContactId) return;
    
    try {
      await createAxiosInstance().delete(`/contacts/${user.id}?contactId=${selectedContactId}`);
      setContacts(contacts.filter(c => c.id !== selectedContactId));
      toast.success('Contact deleted successfully');
    } catch (error) {
      console.error('Failed to delete contact:', error);
      toast.error('Failed to delete contact');
    } finally {
      setShowConfirmation(false);
      setSelectedContactId(null);
    }
  };

  const handleSave = async (contactData: Partial<Contact>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (editingContact?.id) {
        // Update existing contact
        await createAxiosInstance().put(`/contacts/${user.id}`, { ...contactData, id: editingContact.id });
        setContacts(contacts.map(c => c.id === editingContact.id ? { ...c, ...contactData } as Contact : c));
        toast.success('Contact updated successfully');
      } else {
        // Add new contact
        const response = await createAxiosInstance().post(`/contacts/${user.id}`, contactData);
        setContacts([...contacts, response.data]);
        toast.success('Contact added successfully');
      }
      setShowFormPopup(false);
      setEditingContact(null);
    } catch (error: any) {
      console.error('Failed to save contact:', error);
      toast.error(error.response?.data?.error || 'Failed to save contact');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-6 border-b border-[#888]/30 hidden sm:block">
        <h3 className="text-lg font-medium text-[#FCFCFC]">Address Book</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <div className="flex flex-col gap-1 flex-1">
                <h4 className="text-[#FCFCFC] font-medium">Manage Contacts</h4>
                <p className="text-[#5e8284] text-sm">
                  Add and manage your saved blockchain addresses
                </p>
              </div>
              <Button
                onClick={handleAddNew}
                variant="default"
                size="md"
                rounded="full"
                icon={Plus}
              >
                Add Contact
              </Button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingIcon />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#5e8284] text-sm">No contacts saved yet.</p>
                  <p className="text-[#5e8284]/60 text-sm mt-1">Add your first contact using the button above.</p>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`${baseContainerStyle} p-4 rounded-xl relative group`}
                  >
                    <div className="flex-1 min-w-0 pr-20">
                      <h3 className="text-[#FCFCFC] text-sm font-medium">{contact.name}</h3>
                      <p className="text-sm text-[#FCFCFC]/60 font-mono mt-1 truncate">{contact.address}</p>
                      {contact.notes && (
                        <p className="text-sm text-[#5e8284] mt-1 line-clamp-2">Notes: {contact.notes}</p>
                      )}
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => handleEdit(contact)}
                        variant="ghost"
                        size="xs"
                        icon={Edit}
                        iconOnly
                        title="Edit contact"
                      />
                      <Button
                        onClick={() => handleDelete(contact.id)}
                        variant="ghost"
                        size="xs"
                        icon={Trash}
                        iconOnly
                        title="Delete contact"
                        className="text-red-500"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Popup
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setSelectedContactId(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ContactFormPopup
        isOpen={showFormPopup}
        onClose={() => {
          setShowFormPopup(false);
          setEditingContact(null);
        }}
        onSave={handleSave}
        contact={editingContact}
        isSaving={isSaving}
      />
    </div>
  );
};

export default ContractSettings;