export function mapPeerDependenciesToExternals(peerDependencies) {
  return Object.keys(peerDependencies)
    .map((dep) => ({ [dep]: dep }))
    .reduce((acc, next) => Object.assign(acc, next), {});
}
