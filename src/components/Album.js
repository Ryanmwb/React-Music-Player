import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

 class Album extends Component {
  constructor(props) {
     super(props);
     
     const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug
     });
    
     this.state = {
        album: album,
        currentSong: album.songs[0],
        isPlaying: false, 
        hoveredSong: null,
        currentTime: 0,
        duration: album.songs[0].duration, 
        volume: 0.8,
     };
     
     this.audioElement = document.createElement('audio');
     this.audioElement.src = this.state.currentSong.audioSrc;
   }
   
   play() {
       this.audioElement.play()
       this.setState({isPlaying: true});
   }
   
   pause() {
     this.audioElement.pause();
     this.setState({ isPlaying: false });
   }   
   
   setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }
   
   componentDidMount() {
        this.eventListeners = {
       timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
        },
       durationchange: e => {
         this.setState({ duration: this.audioElement.duration });
        }
        };
        this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
        this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
   }

   componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   }
 
   handleTimeChange(e) {
     const newTime = this.audioElement.duration * e.target.value;
     this.audioElement.currentTime = newTime;
     this.setState({ currentTime: newTime });
   }
   
   handleVolumeChange(e){
       const newVolume= e.target.value;
       this.audioElement.volume=newVolume;
       this.setState({ volume: newVolume })
   }
   
   handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
        if (!isSameSong) { this.setSong(song); } 
       this.play();
     }
   }
   
   handleMouseEnter(song){
       this.setState({hoveredSong: song});
       console.log('hovered song is ')
   }
   
   handleMouseLeave(){
        this.setState({hoveredSong: null})
   }
   
   determineIcon(song){
       if (this.state.hoveredSong === song && this.state.currentSong === song && this.state.isPlaying === true){
           return <span className='ion-md-pause'></span>
       } else if (this.state.isPlaying === false && this.state.hoveredSong === song){
           return <span className='ion-md-play-circle'></span>
       }
   }
   
   handlePrevClick(){
       const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
       const newIndex = Math.max(0, currentIndex - 1);
       const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
   }
   
   handleNextClick(){
       const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
       const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
       const newSong = this.state.album.songs[newIndex];
       this.setSong(newSong);
       this.play();
   }
   
   formatTime(time){
    if (!time.isNaN){
      const min = parseInt(time/60);
      const sec = Math.round(time%60);
      return ((sec<10) ? `${min}:0${sec}` : `${min}:${sec}`);
    } else {
      return "-:--";
    }
  }
   
  
   render() {
     return (
       <section className="album">
        <section id="album-info">
           <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
           <div className="album-details">
           <h1 id="album-title">{this.state.album.title}</h1>
           <h2 className="artist">{this.state.album.artist}</h2>
           <div id="release-info">{this.state.album.releaseInfo}</div>
           </div>
         </section>
         <table id="song-list">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>  
           <tbody className='songList'>
                { this.state.album.songs.map( (song, index) =>
                    <tr key = {index} className="song" onMouseEnter={() => this.handleMouseEnter(song)} onMouseLeave={() => this.handleMouseLeave()} onClick={() => this.handleSongClick(song)}> 
                        <td>Title: {song.title}</td>
                        <td>Track#: {index + 1} </td>
                        <td>Duration: {this.formatTime(song.duration)} </td>
                        <td>{this.determineIcon(song)}</td>
                    </tr>
                )
                }
           </tbody>
         </table>
         <PlayerBar
            isPlaying={this.state.isPlaying}
            currentSong={this.state.currentSong}
            currentTime={this.audioElement.currentTime}
            duration={this.audioElement.duration}
            handleSongClick={() => this.handleSongClick(this.state.currentSong)}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            handleTimeChange={(e) => this.handleTimeChange(e)}
            volume={this.state.volume}
            handleVolumeChange={(e) => this.handleVolumeChange(e)}
            formatTime = {(time) => this.formatTime(time)}
         />
       </section>
     );
   }
 }

 export default Album;