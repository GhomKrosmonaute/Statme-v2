
document.addEventListener('DOMContentLoaded', function(){
  const forms = document.querySelectorAll('form.auto-form')
  for(const form of Array.from(forms)){
    const inputs = form.querySelectorAll('input, select')
    for(const input of Array.from(inputs)){
      input.onchange = (function(){
        this.submit()
      }).bind(form)
    }
  }
})