class Scroller {
  top() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

export default new Scroller();