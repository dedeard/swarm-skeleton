import React from 'react'

interface ImageWithLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  node?: any // from react-markdown
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ node: _node, src, alt, ...props }) => {
  return <img src={src} alt={alt} loading="lazy" className="mx-auto block h-auto max-w-full rounded-md shadow-md" {...props} />
}

export default ImageWithLoader
