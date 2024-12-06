
const tl = gsap.timeline()

tl.from(".center-box-rightchild .home-img", {
    y: 100,
    opacity: 0,
    opacity: 0
})



tl.from(".center-box-right-child .header-txt", {
    x: -100,
    opacity:0,
    stagger: 0.2,
    scrollTrigger: {
        trigger: "#works",
        start: "0% 35%",
        end: "10% 20%",
        scrub: 3,
        // markers: true,
    }
})

tl.from(".center-box-right-child .brand-txt", {
    y: 100,
    opacity:0,
    stagger: 0.2,
    scrollTrigger: {
        trigger: "#works",
        start: "10% 35%",
        end: "15% 20%",
        scrub: 3,
        // markers: true,
    }
})

tl.from(".center-box-right-child .sub-brand-txt", {
    x: 100,
    opacity:0,
    stagger: 0.2,
    scrollTrigger: {
        trigger: "#works",
        start: "20% 35%",
        end: "25% 20%",
        scrub: 3,
        // markers: true,
    }
})

tl.from(".center-box-right-child .brand-info ", {
    y: 100,
    opacity:0,
    stagger: 0.2,
    scrollTrigger: {
        trigger: ".brand-txt",
        start: "25% 90%",
        end: "35% 20%",
        scrub: 1,
        // markers: true,
        // pin: true,
    }
})



tl.from(".project-heading-txt-box, .project-heading-txt-box i, .project-box .project-info-txt", {
    y: 100,
    opacity:0,
    stagger: 0.2,
    scrollTrigger: {
        trigger: "#works",
        start: "20% 90%",
        end: "50% 50%",
        scrub: 1,
        // markers: true,
        
    }
})

tl.from(".project-box .project-btn-box", {
    x: -100,
    opacity:0,
    stagger: 0.2,
    scrollTrigger: {
        trigger: "#works",
        start: "25% 90%",
        end: "50% 50%",
        scrub: 1,
        // markers: true,
        
    }
})
