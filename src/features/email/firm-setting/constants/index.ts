export const firmEmailSettingKeys = {
  firmEmailSettings: () => ['firmEmailSettings'] as const,
  firmEmailSettingDetailByBrokerage: () =>
    [...firmEmailSettingKeys.firmEmailSettings(), 'detail'] as const,
}
