import { useCallback, useRef } from "react"
import { useMountEffect } from "./use-mount-effect.js"

const matrixPattern = /matrix\(([^)]+)\)/

function rotationDegrees(element: HTMLElement) {
  const transform = getComputedStyle(element).transform
  const match = transform.match(matrixPattern)
  if (!match?.[1]) return 0
  const [a = 1, b = 0] = match[1].split(",").map(Number)
  return (Math.atan2(b, a) * 180) / Math.PI
}

export function useLogoWobble<T extends HTMLElement>() {
  const logoRef = useRef<T>(null)
  const animationRef = useRef<Animation | null>(null)

  useMountEffect(() => () => animationRef.current?.cancel())

  const onLogoHover = useCallback(() => {
    const element = logoRef.current
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return
    const current = rotationDegrees(element)
    const start = ((((current + 180) % 360) + 360) % 360) - 180
    animationRef.current?.cancel()
    element.style.animation = "none"
    const animation = element.animate(
      [
        { transform: `rotate(${start}deg)` },
        { transform: "rotate(-20deg)", offset: 0.5 },
        { transform: "rotate(8deg)", offset: 0.72 },
        { transform: "rotate(-3deg)", offset: 0.88 },
        { transform: "rotate(0deg)" },
      ],
      {
        duration: 600,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        fill: "none",
      },
    )
    animationRef.current = animation
    animation.onfinish = () => {
      if (animationRef.current !== animation) return
      element.style.animation = ""
      animation.cancel()
      animationRef.current = null
    }
  }, [])

  return { logoRef, onLogoHover }
}
