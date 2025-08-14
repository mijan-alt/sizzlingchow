import { type DefaultTranslationKeys, type TFunction } from "@payloadcms/translations";
import { Button } from "@payloadcms/ui";
import { RenderServerComponent } from "@payloadcms/ui/elements/RenderServerComponent";
import { type EntityToGroup, EntityType, groupNavItems } from "@payloadcms/ui/shared";
import Link from "next/link";
import { type ClientUser, type Locale, type ServerProps } from "payload";

import { type CustomTranslationsKeys } from "@/admin/translations/custom-translations";

import { AdminDatePicker } from "./components/AdminDatePicker";
import { AdminSearch } from "./components/AdminSearch";
import { AdminTabs } from "./components/AdminTabs";
import { AdminViews } from "./components/views";

export type DashboardViewClientProps = {
  locale: Locale;
};

export type DashboardViewServerPropsOnly = {
  globalData: {
    data: { _isLocked: boolean; _lastEditedAt: string; _userEditing: ClientUser | number | string };
    lockDuration?: number;
    slug: string;
  }[];
  /**
   * @deprecated
   * This prop is deprecated and will be removed in the next major version.
   * Components now import their own `Link` directly from `next/link`.
   */
  Link?: React.ComponentType;
  navGroups?: ReturnType<typeof groupNavItems>;
} & ServerProps;

export type DashboardViewServerProps = DashboardViewClientProps & DashboardViewServerPropsOnly;

export const AdminDashboard = async (props: DashboardViewServerProps) => {
  const {
    i18n,
    locale,
    params,
    payload: {
      config: {
        admin: {
          components: { beforeDashboard },
        },
        collections,
        globals,
      },
    },
    payload,
    permissions,
    searchParams,
    user,
  } = props;

  const t: TFunction<CustomTranslationsKeys | DefaultTranslationKeys> = i18n.t;

  const groups = groupNavItems(
    [
      ...collections
        .filter((collection) => !collection.admin.hidden)
        .map(
          (collection) =>
            ({
              type: EntityType.collection,
              entity: collection,
            }) satisfies EntityToGroup,
        ),
      ...globals
        .filter((global) => !global.admin.hidden)
        .map(
          (global) =>
            ({
              type: EntityType.global,
              entity: global,
            }) satisfies EntityToGroup,
        ),
    ],
    permissions!,
    i18n,
  );

  return (
    <>
      <main className="gutter--left gutter--right dashboard__wrap">
        {beforeDashboard &&
          RenderServerComponent({
            Component: beforeDashboard,
            importMap: payload.importMap,
            serverProps: {
              i18n,
              locale,
              params,
              payload,
              permissions,
              searchParams,
              user,
            } satisfies ServerProps,
          })}
        <section className="flex flex-wrap items-center gap-4">
          <h1 className="mr-auto">{t("adminDashboard:linkTitle")}</h1>
          <AdminSearch groups={groups} />
          <Button
            Link={Link}
            url="/admin/collections/products/create"
            to="/admin/collections/products/create"
            el="link"
            className="my-0 block min-h-11"
            icon="plus"
          >
            {t("adminDashboard:addProduct")}
          </Button>
        </section>
        <section className="twp my-6 flex flex-col justify-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <AdminTabs />
          <AdminDatePicker />
        </section>
        <AdminViews />
      </main>
    </>
  );
};
