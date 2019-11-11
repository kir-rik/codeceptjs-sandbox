// TODO: configure this
module.exports = {
  storybookStatic: `${__dirname}/.tmp/static`,
  storybookConfigFolder: `${__dirname}/.storybook`,
  // clis need to be found by require
  storybookCli: 'node ' + require.resolve('@storybook/react/dist/server/build'),
  storybookDevCli: 'node ./node_modules/.bin/start-storybook',
  jestCli: 'node ' + require.resolve('jest/bin/jest'),
}
