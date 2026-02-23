import { useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useAnimations = () => {

    const initAnimations = useCallback(() => {
        // Kill existing triggers to avoid duplicates and leaks
        ScrollTrigger.getAll().forEach(t => t.kill());

        // 1. Smooth Fade-in + slight upward motion on scroll
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach((el) => {
            gsap.fromTo(el,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    force3D: true,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // 2. Staggered reveal for cards
        const cardGrids = document.querySelectorAll('.stagger-grid');
        cardGrids.forEach((grid) => {
            const cards = grid.querySelectorAll('.card, .stagger-item, article');
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    {
                        opacity: 0,
                        y: 40
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.1,
                        ease: 'power3.out',
                        force3D: true,
                        scrollTrigger: {
                            trigger: grid,
                            start: 'top 80%'
                        }
                    }
                );
            }
        });

        // 3. Cinematic Text Reveal
        const textReveals = document.querySelectorAll('.text-reveal');
        textReveals.forEach((el) => {
            gsap.fromTo(el,
                {
                    clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                    x: -20
                },
                {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    x: 0,
                    duration: 1.5,
                    ease: 'power4.out',
                    force3D: true,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%'
                    }
                }
            );
        });

        // 4. Parallax effect - restricted to desktop
        if (window.innerWidth > 768) {
            const parallaxElements = document.querySelectorAll('.parallax');
            parallaxElements.forEach((el) => {
                const speed = el.dataset.speed || 0.1;
                gsap.to(el, {
                    y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
                    ease: 'none',
                    force3D: true,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                });
            });
        }

        ScrollTrigger.refresh();
    }, []);

    const animatePageIn = useCallback(() => {
        gsap.fromTo('.App',
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 0.8,
                ease: 'none',
                clearProps: 'all',
                onComplete: () => {
                    gsap.set('.App', { opacity: 1, visibility: 'visible' });
                }
            }
        );
    }, []);

    return { initAnimations, animatePageIn };
};

export default useAnimations;
