export class LatexEnvironmentsSettings {
  public defaultEnvironment = 'multline';
  public customEnvironments: string[] = [];
}

export type LoadedSettings = Partial<LatexEnvironmentsSettings>;

export function ensureSettings(
  loaded: LoadedSettings,
): LatexEnvironmentsSettings {
  const settings = new LatexEnvironmentsSettings();

  settings.defaultEnvironment =
    loaded.defaultEnvironment ?? settings.defaultEnvironment;

  settings.customEnvironments =
    loaded.customEnvironments ?? settings.customEnvironments;

  return settings;
}
