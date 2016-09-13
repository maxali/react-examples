#Multiple Components#

DataFlow is from Parent -> Child -> Children

Events can be passed from Parent to child via *props* like `onChange="this.onChange"`

Child components can get props with event functions like this.
```javascript
const NameInput = ({onChange, name}) => {
  
}
```


Child components are better to be *Stateless*
