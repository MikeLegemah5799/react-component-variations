import getVariations from '../../src/helpers/getVariations';

jest.mock('../../src/helpers/validateProject', () => jest.fn());
jest.mock('../../src/helpers/globToFiles', () => jest.fn(() => ['a', 'b']));
jest.mock('../../src/helpers/requireFiles', () => jest.fn(paths => paths.reduce((obj, path) => ({
  ...obj,
  [path]: {
    actualPath: path,
    Module: { default() {} },
  },
}), {})));

describe('getVariations', () => {
  beforeEach(() => {
    require('../../src/helpers/validateProject').mockClear();
    require('../../src/helpers/globToFiles').mockClear();
    require('../../src/helpers/requireFiles').mockClear();
  });

  it('validates the provided config', () => {
    const projectConfig = {
      variations: 'foo',
      extensions: ['.js', '.jsx'],
    };
    const mock = require('../../src/helpers/validateProject');
    const projectRoot = 'a/b/c';

    getVariations(projectConfig, projectRoot);

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(projectConfig);
  });

  it('passes variations path to `globToFiles`', () => {
    const projectConfig = {
      variations: 'foo',
      extensions: ['.js', '.jsx'],
    };
    const mock = require('../../src/helpers/globToFiles');
    const projectRoot = 'a/b/c';

    getVariations(projectConfig, projectRoot);

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(projectConfig.variations);
  });

  it('passes expected args to `requireFiles`', () => {
    const projectConfig = {
      variations: 'foo',
      extensions: ['.js', '.jsx'],
    };
    const globOutput = require('../../src/helpers/globToFiles')();
    const mock = require('../../src/helpers/requireFiles');
    const projectRoot = 'a/b/c';

    getVariations(projectConfig, projectRoot);

    expect(mock).toHaveBeenCalledTimes(1);
    const { calls: [args] } = mock.mock;
    const [actualGlobOutput, requireOptions] = args;
    expect(actualGlobOutput).toEqual(globOutput);
    expect(requireOptions).toMatchObject({
      projectRoot,
      extensions: projectConfig.extensions,
    });
  });
});
