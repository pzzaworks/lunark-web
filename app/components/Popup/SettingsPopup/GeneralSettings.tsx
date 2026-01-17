"use client";

import { Archive, LogOut, Trash } from 'iconoir-react';
import Dropdown from '../../Base/Dropdown';
import Button from '../../Base/Button';
import { useRouter } from 'next/navigation';

interface GeneralSettingsProps {
  language: string;
  setLanguage: (value: string) => void;
  onDeleteAllChats: () => void;
  onDisconnect: () => void;
  isDeleting?: boolean;
  isDisconnecting?: boolean;
  chatCount?: number;
}

const languageOptions = [
  { value: 'en', label: 'English' },
];

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  language,
  setLanguage,
  onDeleteAllChats,
  onDisconnect,
  isDeleting = false,
  isDisconnecting = false,
  chatCount = 0
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-6 border-b border-[#888]/30 hidden sm:block">
        <h3 className="text-lg font-medium text-[#FCFCFC]">General Settings</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <div className="flex flex-col gap-1 flex-1">
                <h4 className="text-[#FCFCFC] font-medium">Language</h4>
                <p className="text-[#5e8284] text-sm">
                  Select your preferred language for the interface.
                </p>
              </div>
              <Dropdown
                value={language}
                options={languageOptions}
                onChange={setLanguage}
                className="w-32"
              />
            </div>

            <div className="w-[90%] mx-auto h-px bg-[#888]/30" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <div className="flex flex-col gap-1 flex-1">
                <h4 className="text-[#FCFCFC] font-medium">Chat History</h4>
                <p className="text-[#5e8284] text-sm">
                  Manage your chat history and archives.
                </p>
              </div>
              <Button
                onClick={() => router.push('/history')}
                variant="default"
                size="md"
                rounded="full"
                icon={Archive}
              >
                History
              </Button>
            </div>

            <div className="w-[90%] mx-auto h-px bg-[#888]/30" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <div className="flex flex-col gap-1 flex-1">
                <h4 className="text-[#FCFCFC] font-medium">Delete All Chats</h4>
                <p className="text-[#5e8284] text-sm">
                  Delete all your chat history. This action cannot be undone.
                </p>
              </div>
              <Button
                onClick={onDeleteAllChats}
                disabled={isDeleting || chatCount === 0}
                loading={isDeleting}
                variant="default"
                size="md"
                rounded="full"
                icon={Trash}
                className="border-red-500/50 hover:border-red-500/75"
              >
                Delete All
              </Button>
            </div>

            <div className="w-[90%] mx-auto h-px bg-[#888]/30" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <div className="flex flex-col gap-1 flex-1">
                <h4 className="text-[#FCFCFC] font-medium">Log Out on This Device</h4>
                <p className="text-[#5e8284] text-sm">
                  Sign out from your current session on this device.
                </p>
              </div>
              <Button
                onClick={onDisconnect}
                disabled={isDisconnecting}
                loading={isDisconnecting}
                variant="default"
                size="md"
                rounded="full"
                icon={LogOut}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings; 