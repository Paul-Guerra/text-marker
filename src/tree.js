import TreeBuilder from './tree_builder';

export default function makeTree(tokens, Builder = TreeBuilder) {
  let treeBuilder = new Builder();

  tokens.forEach((token)=>{
    switch (token.type) {
      case 'LITERAL':
        treeBuilder.addLeaf(token);
        break;
      case 'KEYWORD':
        treeBuilder.addLeaf(token);
        break;
      case 'RANGE_START':
      case 'BLOCK_START':
        treeBuilder.startBranch(token);
        break;
      case 'RANGE_END':
      case 'BLOCK_END':
        treeBuilder.endBranch();
        break;
      default:
        break;
    }
  });

  return treeBuilder.tree;
}
