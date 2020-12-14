/*
 * Copyright (c) 2019 La Maison Fantastique - All Rights Reserved
 */
module.exports = {
  plugins: [
    { addAttributesToSVGElement: false }, // adds attributes to an outer <svg> element (disabled by default)
    { addClassesToSVGElement: false }, // add classnames to an outer <svg> element (disabled by default)
    { cleanupAttrs: true }, // cleanup attributes from newlines, trailing, and repeating spaces
    { cleanupEnableBackground: true }, // remove or cleanup enable-background attribute when possible
    { cleanupIDs: true }, // remove unused and minify used IDs
    { cleanupListOfValues: 2 }, // round numeric values in attributes that take a list of numbers (like viewBox or enable-background)
    { cleanupNumericValues: 2 }, // round numeric values to the fixed precision, remove default px units
    { collapseGroups: true }, // collapse useless groups
    { convertColors: true }, // convert colors (from rgb() to #rrggbb, from #rrggbb to #rgb)
    { convertPathData: { noSpaceAfterFlags: false } }, // convert Path data to relative or absolute (whichever is shorter), convert one segment to another, trim useless delimiters, smart rounding, and much more
    { convertShapeToPath: true }, // convert some basic shapes to <path>
    { convertStyleToAttrs: true }, // convert styles into attributes
    { convertTransform: true }, // collapse multiple transforms into one, convert matrices to the short aliases, and much more
    { inlineStyles: true }, // move and merge styles from <style> elements to element style attributes
    { mergePaths: { noSpaceAfterFlags: false } }, // merge multiple Paths into one
    { minifyStyles: true }, // minify <style> elements content with CSSO
    { moveElemsAttrsToGroup: true }, // move elements' attributes to their enclosing group
    { moveGroupAttrsToElems: true }, // move some group attributes to the contained elements
    { prefixIds: false }, // prefix IDs and classes with the SVG filename or an arbitrary string
    { removeAttributesBySelector: false }, // removes attributes of elements that match a css selector (disabled by default)
    { removeAttrs: false }, // remove attributes by pattern (disabled by default)
    { removeComments: true }, // remove comments
    { removeDesc: true }, // remove <desc>
    { removeDimensions: true }, // remove width/height attributes if viewBox is present (opposite to removeViewBox, disable it first) (disabled by default)
    { removeDoctype: true }, // remove doctype declaration
    { removeEditorsNSData: true }, // remove editors namespaces, elements, and attributes
    { removeElementsByAttr: false }, // remove arbitrary elements by ID or className (disabled by default)
    { removeEmptyAttrs: true }, // remove empty attributes
    { removeEmptyContainers: true }, // remove empty Container elements
    { removeEmptyText: true }, // remove empty Text elements
    { removeHiddenElems: true }, // remove hidden elements
    { removeMetadata: true }, // remove <metadata>
    { removeNonInheritableGroupAttrs: true }, // remove non-inheritable group's "presentation" attributes
    { removeOffCanvasPaths: false }, // removes elements that are drawn outside of the viewbox (disabled by default)
    { removeRasterImages: true }, // remove raster images (disabled by default)
    { removeScriptElement: true }, // remove <script> elements (disabled by default)
    { removeStyleElement: true }, // remove <style> elements (disabled by default)
    { removeTitle: true }, // remove <title>
    { removeUnknownsAndDefaults: true }, // remove unknown elements content and attributes, remove attrs with default values
    { removeUnusedNS: true }, // remove unused namespaces declaration
    { removeUselessDefs: true }, // remove elements of <defs> without id
    { removeUselessStrokeAndFill: true }, // remove useless stroke and fill attrs
    { removeViewBox: false }, // remove viewBox attribute when possible
    { removeXMLNS: false }, // removes xmlns attribute (for inline svg, disabled by default)
    { removeXMLProcInst: true }, // remove XML processing instructions
    { reusePaths: false }, // Find duplicated elements and replace them with links (disabled by default)
    { sortAttrs: false }, // sort element attributes for epic readability (disabled by default)
  ],
};
