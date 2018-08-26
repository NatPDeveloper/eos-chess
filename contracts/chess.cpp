#include "chess.hpp"

namespace Game{

    void Chess::setmove(account_name account, string match_id, string move) {
        require_auth(account);

        // print to node
        print( "Hello, ", name{account}, " match_id: ",  match_id, " move: ", move);
    }

}