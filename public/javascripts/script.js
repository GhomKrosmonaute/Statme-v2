
document.addEventListener('DOMContentLoaded', function(){
  const forms = document.querySelectorAll('form.auto-form')
  forms.forEach( form => {
    form.querySelectorAll('input, select')
      .forEach( input => {
        input.onchange = (function(){
          this.submit()
        }).bind(form)
      })
  })
})