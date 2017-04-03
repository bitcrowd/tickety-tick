module Models exposing (..)

type alias Fmt =
  { commit : String
  , branch : String
  , cmd : String
  }

type alias Ticket =
  { id : String
  , kind : String
  , title : String
  , fmt : Fmt
  }
