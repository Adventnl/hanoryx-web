import { lazy } from 'react';

/* Live examples for the Components pages. Each family's demos are one lazy chunk,
   so a page downloads only the family it shows. The key is the export name in the
   catalogue (data/kit.js → `demo`). */
const pick = (load, name) => lazy(() => load().then((m) => ({ default: m[name] })));

const inputs = () => import('./InputDemos');
const nav = () => import('./NavDemos');
const feedback = () => import('./FeedbackDemos');
const data = () => import('./DataDemos');
const overlays = () => import('./OverlayDemos');
const content = () => import('./ContentDemos');

export const demoRegistry = {
  FieldDemo: pick(inputs, 'FieldDemo'),
  TextFieldDemo: pick(inputs, 'TextFieldDemo'),
  TextAreaDemo: pick(inputs, 'TextAreaDemo'),
  NumberFieldDemo: pick(inputs, 'NumberFieldDemo'),
  SearchFieldDemo: pick(inputs, 'SearchFieldDemo'),
  PasswordFieldDemo: pick(inputs, 'PasswordFieldDemo'),
  SelectFieldDemo: pick(inputs, 'SelectFieldDemo'),
  ComboboxDemo: pick(inputs, 'ComboboxDemo'),
  CheckboxDemo: pick(inputs, 'CheckboxDemo'),
  RadioGroupDemo: pick(inputs, 'RadioGroupDemo'),
  SwitchDemo: pick(inputs, 'SwitchDemo'),
  RangeFieldDemo: pick(inputs, 'RangeFieldDemo'),
  SegmentedDemo: pick(inputs, 'SegmentedDemo'),
  TagInputDemo: pick(inputs, 'TagInputDemo'),
  FileDropDemo: pick(inputs, 'FileDropDemo'),

  BreadcrumbsDemo: pick(nav, 'BreadcrumbsDemo'),
  PaginationDemo: pick(nav, 'PaginationDemo'),
  StepperDemo: pick(nav, 'StepperDemo'),
  TabsDemo: pick(nav, 'TabsDemo'),
  SideNavDemo: pick(nav, 'SideNavDemo'),
  DropdownMenuDemo: pick(nav, 'DropdownMenuDemo'),
  OnThisPageDemo: pick(nav, 'OnThisPageDemo'),
  ToolbarDemo: pick(nav, 'ToolbarDemo'),

  AlertDemo: pick(feedback, 'AlertDemo'),
  ToastDemo: pick(feedback, 'ToastDemo'),
  BannerDemo: pick(feedback, 'BannerDemo'),
  ProgressBarDemo: pick(feedback, 'ProgressBarDemo'),
  MeterDemo: pick(feedback, 'MeterDemo'),
  SpinnerDemo: pick(feedback, 'SpinnerDemo'),
  SkeletonDemo: pick(feedback, 'SkeletonDemo'),
  EmptyStateDemo: pick(feedback, 'EmptyStateDemo'),
  StatusDotDemo: pick(feedback, 'StatusDotDemo'),

  BadgeDemo: pick(data, 'BadgeDemo'),
  ChipDemo: pick(data, 'ChipDemo'),
  AvatarDemo: pick(data, 'AvatarDemo'),
  StatDemo: pick(data, 'StatDemo'),
  DataTableDemo: pick(data, 'DataTableDemo'),
  DescriptionListDemo: pick(data, 'DescriptionListDemo'),
  TimelineDemo: pick(data, 'TimelineDemo'),
  TreeDemo: pick(data, 'TreeDemo'),
  CodeBlockDemo: pick(data, 'CodeBlockDemo'),
  SparklineDemo: pick(data, 'SparklineDemo'),
  BarListDemo: pick(data, 'BarListDemo'),

  TooltipDemo: pick(overlays, 'TooltipDemo'),
  PopoverDemo: pick(overlays, 'PopoverDemo'),
  HoverCardDemo: pick(overlays, 'HoverCardDemo'),
  DialogDemo: pick(overlays, 'DialogDemo'),
  DrawerDemo: pick(overlays, 'DrawerDemo'),
  ConfirmDialogDemo: pick(overlays, 'ConfirmDialogDemo'),

  CardDemo: pick(content, 'CardDemo'),
  CalloutDemo: pick(content, 'CalloutDemo'),
  QuoteDemo: pick(content, 'QuoteDemo'),
  FigureDemo: pick(content, 'FigureDemo'),
  DividerDemo: pick(content, 'DividerDemo'),
  ProseDemo: pick(content, 'ProseDemo'),
  StackDemo: pick(content, 'StackDemo'),
  ClusterDemo: pick(content, 'ClusterDemo'),
  GridDemo: pick(content, 'GridDemo'),
  DisclosureDemo: pick(content, 'DisclosureDemo'),
  AspectRatioDemo: pick(content, 'AspectRatioDemo'),
  VisuallyHiddenDemo: pick(content, 'VisuallyHiddenDemo'),
};
