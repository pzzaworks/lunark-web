import { source } from '@/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { ReactNode } from 'react';
import Image from 'next/image';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <DocsLayout
            tree={source.pageTree}
            nav={{
                transparentMode: 'top',
                title: (
                    <div className="flex items-center gap-2 ml-2">
                        <Image
                            src="/images/icons/icon-light.svg"
                            alt="Lunark AI"
                            width={24}
                            height={24}
                        />
                        <span>Lunark AI</span>
                    </div>
                ),
                mode: 'top',
            }}
            sidebar={{
                defaultOpenLevel: 0,
            }}
            themeSwitch={{
                enabled: false,
            }}
            tabMode="sidebar"
            githubUrl="https://github.com/pzzaworks/lunark"
        >
            {children}
        </DocsLayout>
    );
}
