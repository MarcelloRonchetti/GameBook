const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withGradleMemory(config) {
  return withGradleProperties(config, (config) => {
    config.modResults = config.modResults.filter(
      (item) => !(item.type === 'property' && item.key === 'org.gradle.jvmargs')
    );
    config.modResults.push({
      type: 'property',
      key: 'org.gradle.jvmargs',
      value: '-Xmx3072m -XX:MaxMetaspaceSize=512m',
    });
    config.modResults.push({
      type: 'property',
      key: 'org.gradle.daemon',
      value: 'false',
    });
    return config;
  });
};
