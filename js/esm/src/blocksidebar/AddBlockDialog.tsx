// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * "Add a block" dialog: a searchable list of the blocks that can be added to the bar.
 *
 * Replaces core_block/add_modal for the bar's region and works the same way: the list comes from
 * core_block_fetch_addable_blocks; a block is added by loading the page with bui_addblock=<name>, or, for blocks
 * that ask for settings first, through their add form in a core_form/modalform.
 *
 * @module     theme_retani_studio/blocksidebar/AddBlockDialog
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {useEffect, useId, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {fetchOne} from '@moodle/lms/core/ajax';
import {requireAsync} from '@moodle/lms/core/amd';
import {Icon, blockIconPath} from './icons';
import type {AddBlockConfig, AddableBlock, BlockSidebarStrings} from './types';

interface ModalFormInstance {
    events: {FORM_SUBMITTED: string};
    addEventListener: (event: string, callback: () => void) => void;
    show: () => Promise<unknown>;
}

type ModalFormClass = new (config: Record<string, unknown>) => ModalFormInstance;

interface AddBlockDialogProps {
    config: AddBlockConfig;
    strings: BlockSidebarStrings;
    onClose: () => void;
}

/**
 * Add a block that asks for settings first, through its add form (as core_block/add_modal does).
 *
 * @param block The block.
 * @param config Where the block is added.
 * @param title The modal title.
 * @param returnFocus The element to focus when the form closes.
 */
const showAddForm = async(block: AddableBlock, config: AddBlockConfig, title: string, returnFocus: HTMLElement | null) => {
    const ModalForm = await requireAsync<ModalFormClass>('core_form/modalform');
    const form = new ModalForm({
        modalConfig: {title},
        args: {blockname: block.name, pagehash: config.pagehash, blockregion: config.region},
        formClass: block.blockform,
        returnFocus,
    });
    form.addEventListener(form.events.FORM_SUBMITTED, () => window.location.reload());
    await form.show();
};

/**
 * The dialog.
 *
 * @param props Component props.
 * @returns The dialog, portalled to the end of the body.
 */
export default function AddBlockDialog({config, strings, onClose}: AddBlockDialogProps) {
    const [blocks, setBlocks] = useState<AddableBlock[] | null>(null);
    const [failed, setFailed] = useState(false);
    const [query, setQuery] = useState('');
    const search = useRef<HTMLInputElement>(null);
    const titleid = useId();

    useEffect(() => {
        let current = true;
        fetchOne<AddableBlock[]>({
            methodname: 'core_block_fetch_addable_blocks',
            args: {pagecontextid: 0, pagetype: '', pagelayout: '', subpage: '', pagehash: config.pagehash},
        }).then(list => {
            if (current) {
                setBlocks(list);
            }
            return list;
        }).catch(() => {
            if (current) {
                setFailed(true);
            }
        });
        return () => {
            current = false;
        };
    }, [config.pagehash]);

    // Focus the search field, close on Escape, and keep the page behind still.
    useEffect(() => {
        const opener = document.activeElement as HTMLElement | null;
        search.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onKey);
        document.body.classList.add('retani-addblock-open');
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.classList.remove('retani-addblock-open');
            opener?.focus();
        };
    }, [onClose]);

    const shown = useMemo(() => {
        const q = query.trim().toLowerCase();
        return (blocks ?? []).filter(b => !q || `${b.title} ${b.name}`.toLowerCase().includes(q));
    }, [blocks, query]);

    const add = (block: AddableBlock, row: HTMLElement) => {
        if (block.blockform) {
            onClose();
            showAddForm(block, config, `${strings.addblock}: ${block.title}`, row).catch(() => undefined);
            return;
        }
        const url = new URL(config.url, window.location.href);
        url.searchParams.set('bui_addblock', block.name);
        window.location.href = url.toString();
    };

    let body;
    if (failed || (blocks && !blocks.length)) {
        body = <p className="retani-addblock-empty">{strings.noblocks}</p>;
    } else if (!blocks) {
        body = <p className="retani-addblock-empty" role="status">{strings.loading}</p>;
    } else if (!shown.length) {
        body = <p className="retani-addblock-empty" role="status">{strings.nomatch.replace('{$a}', query.trim())}</p>;
    } else {
        body = (
            <ul className="retani-addblock-list">
                {shown.map(block => (
                    <li key={block.name}>
                        <button
                            type="button"
                            className="retani-addblock-item"
                            onClick={e => add(block, e.currentTarget)}
                        >
                            <span className="retani-addblock-icon">
                                <Icon path={blockIconPath(block.name)} size={14} strokeWidth={2.1} />
                            </span>
                            <span className="retani-addblock-name">{block.title}</span>
                            <span className="retani-addblock-action">{strings.add}</span>
                        </button>
                    </li>
                ))}
            </ul>
        );
    }

    return createPortal(
        <div className="retani-addblock-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
            <div className="retani-addblock" role="dialog" aria-modal="true" aria-labelledby={titleid}>
                <div className="retani-addblock-header">
                    <span className="retani-addblock-badge" aria-hidden="true"><Icon name="plus" size={16} strokeWidth={2.2} /></span>
                    <h2 className="retani-addblock-title" id={titleid}>{strings.addblock}</h2>
                    <button type="button" className="retani-addblock-close" title={strings.closebuttontitle} onClick={onClose}>
                        <Icon name="close" size={12} strokeWidth={2.2} />
                        <span className="visually-hidden">{strings.closebuttontitle}</span>
                    </button>
                </div>
                <div className="retani-addblock-search">
                    <Icon name="search" size={13} />
                    <input
                        ref={search}
                        type="search"
                        value={query}
                        placeholder={strings.search}
                        aria-label={strings.search}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
                <div className="retani-addblock-body">{body}</div>
                <div className="retani-addblock-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>{strings.cancel}</button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
