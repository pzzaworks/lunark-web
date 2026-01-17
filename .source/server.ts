// @ts-nocheck
import { default as __fd_glob_22 } from "../content/docs/tools/meta.json?collection=meta"
import { default as __fd_glob_21 } from "../content/docs/meta.json?collection=meta"
import * as __fd_glob_20 from "../content/docs/tools/wallet-balance.mdx?collection=docs"
import * as __fd_glob_19 from "../content/docs/tools/transfer-tokens.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/tools/token-utils.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/tools/smart-contracts.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/tools/nft-management.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/tools/network-switching.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/tools/defi-operations.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/tools/contacts.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/tools/blockchain-balance.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/tools/approve-tokens.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/tools/advanced-analytics.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/what-is-lunark.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/wallet-management.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/usage-tracking.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/usage-pricing.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/token-transfers.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/supported-tokens.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/supported-networks.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/quick-start.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/contact-management.mdx?collection=docs"
import * as __fd_glob_0 from "../content/docs/chat-assistant.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.doc("docs", "content/docs", {"chat-assistant.mdx": __fd_glob_0, "contact-management.mdx": __fd_glob_1, "quick-start.mdx": __fd_glob_2, "supported-networks.mdx": __fd_glob_3, "supported-tokens.mdx": __fd_glob_4, "token-transfers.mdx": __fd_glob_5, "usage-pricing.mdx": __fd_glob_6, "usage-tracking.mdx": __fd_glob_7, "wallet-management.mdx": __fd_glob_8, "what-is-lunark.mdx": __fd_glob_9, "tools/advanced-analytics.mdx": __fd_glob_10, "tools/approve-tokens.mdx": __fd_glob_11, "tools/blockchain-balance.mdx": __fd_glob_12, "tools/contacts.mdx": __fd_glob_13, "tools/defi-operations.mdx": __fd_glob_14, "tools/network-switching.mdx": __fd_glob_15, "tools/nft-management.mdx": __fd_glob_16, "tools/smart-contracts.mdx": __fd_glob_17, "tools/token-utils.mdx": __fd_glob_18, "tools/transfer-tokens.mdx": __fd_glob_19, "tools/wallet-balance.mdx": __fd_glob_20, });

export const meta = await create.meta("meta", "content/docs", {"meta.json": __fd_glob_21, "tools/meta.json": __fd_glob_22, });